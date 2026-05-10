"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { awardPoints } from "@/lib/points";

export async function createPost(content: string, imageUrl?: string, parentId?: string, communityId?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    });

    if (!user) throw new Error("User not found");

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        imageUrl,
        authorId: user.id,
        parentId: parentId || null,
        communityId: communityId || null,
      },
      include: { 
        parent: {
          include: { author: true }
        }
      }
    });

    // Create notification for reply
    if (parentId && post.parent?.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          type: "REPLY",
          userId: post.parent!.authorId,
          issuerId: user.id,
          postId: post.id,
        },
      });
    }

    // Award points: 50 for post, 20 for reply
    await awardPoints(user.id, parentId ? "REPLY" : "POST");

    revalidatePath("/");
    return { success: true, post };
  } catch (error: any) {
    console.error("CREATE_POST_ERROR:", error);
    throw error;
  }
}

export async function reactToPost(postId: string, type: "LIKE" | "FUCK_YOU") {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user) throw new Error("User not found");

  try {
    const reaction = await prisma.reaction.create({
      data: {
        postId,
        userId: user.id,
        type,
      },
      include: { post: true }
    });

    // Create notification for reaction
    if (reaction.post.authorId !== user.id) {
      await prisma.notification.create({
        data: {
          type: type === "LIKE" ? "LIKE" : "REPOST",
          userId: reaction.post.authorId,
          issuerId: user.id,
          postId,
        },
      });
    }

    // Award points
    await awardPoints(user.id, "REACTION");
  } catch (e) {
    // Toggle reaction (delete if exists)
    await prisma.reaction.deleteMany({
      where: {
        postId,
        userId: user.id,
        type,
      }
    });
  }

  revalidatePath("/");
}


export async function getNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user) throw new Error("User not found");

  return await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      issuer: {
        select: {
          id: true,
          username: true,
          image: true,
          walletAddress: true,
        }
      },
      post: {
        select: {
          id: true,
          content: true,
        }
      }
    }
  });
}

export async function markNotificationsAsRead() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user) throw new Error("User not found");

  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/notifications");
}

export async function deletePost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  // In a real app, check for admin role
  // For the rebellion, maybe only the author or a specific wallet can delete
  
  await prisma.post.delete({
    where: { id: postId }
  });

  revalidatePath("/");
}

export async function getCommunities() {
  return await prisma.community.findMany({
    orderBy: { memberCount: "desc" },
  });
}

export async function createCommunity(data: { name: string, slug: string, description?: string, avatar?: string, banner?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  // Clean slug
  const slug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  const existing = await prisma.community.findUnique({ where: { slug } });
  if (existing) throw new Error("Slug already taken");

  const community = await prisma.community.create({
    data: {
      ...data,
      slug,
      memberCount: 1,
      members: {
        create: {
          userId,
          role: "admin"
        }
      }
    }
  });

  revalidatePath("/communities");
  return community;
}

export async function getCommunityBySlug(slug: string) {
  return await prisma.community.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { members: true, posts: true }
      }
    }
  });
}

export async function joinCommunity(communityId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  try {
    await prisma.$transaction([
      prisma.communityMember.create({
        data: {
          userId,
          communityId,
        }
      }),
      prisma.community.update({
        where: { id: communityId },
        data: { memberCount: { increment: 1 } }
      })
    ]);

    revalidatePath("/communities");
    revalidatePath(`/community/${communityId}`);
    return { success: true };
  } catch (e) {
    console.error("JOIN_COMMUNITY_ERROR:", e);
    return { success: false };
  }
}

export async function leaveCommunity(communityId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  try {
    const membership = await prisma.communityMember.findFirst({
      where: { userId, communityId }
    });

    if (membership) {
      await prisma.$transaction([
        prisma.communityMember.delete({
          where: { id: membership.id }
        }),
        prisma.community.update({
          where: { id: communityId },
          data: { memberCount: { decrement: 1 } }
        })
      ]);
    }

    revalidatePath("/communities");
    revalidatePath(`/community/${communityId}`);
    return { success: true };
  } catch (e) {
    console.error("LEAVE_COMMUNITY_ERROR:", e);
    return { success: false };
  }
}

export async function getJoinedCommunities() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  const userId = (session.user as any).id;

  return await prisma.community.findMany({
    where: {
      members: {
        some: { userId }
      }
    }
  });
}

export async function getPosts(page: number = 0, filter: "for-you" | "following" | string = "for-you") {
  const session = await getServerSession(authOptions);
  let followingIds: string[] = [];

  if (filter === "following" && session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      include: { following: true }
    });
    followingIds = user?.following.map(f => f.followingId) || [];
    
    // If not following anyone, show nothing or maybe a message? 
    // For now, if following is empty, return empty array to encourage following.
    if (followingIds.length === 0) return [];
  }

  return await prisma.post.findMany({
    where: {
      parentId: null,
      authorId: filter === "following" ? { in: followingIds } : undefined,
      communityId: (filter !== "for-you" && filter !== "following") ? filter : null,
    },
    take: 20,
    skip: page * 20,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          walletAddress: true,
          image: true,
          points: true,
        }
      },
      reactions: true,
      community: true,
      _count: {
        select: { 
          reactions: true,
          replies: true,
        },
      },
    },
  });
}

export async function getPostThread(postId: string) {
  return await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      reactions: true,
      replies: {
        include: {
          author: true,
          reactions: true,
          _count: {
            select: { reactions: true, replies: true },
          }
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });
}

export async function getSuggestedUsers() {
  const session = await getServerSession(authOptions);
  let excludeId: string | undefined;

  if (session?.user) {
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    });
    excludeId = user?.id;
  }

  return await prisma.user.findMany({
    where: {
      NOT: excludeId ? { id: excludeId } : undefined,
    },
    take: 5,
    orderBy: { points: "desc" },
    select: {
      id: true,
      username: true,
      walletAddress: true,
      image: true,
      points: true,
    }
  });
}

export async function getUnreadNotificationCount() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return 0;

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user) return 0;

  return await prisma.notification.count({
    where: { userId: user.id, read: false },
  });
}
