"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { awardPoints, POINTS_CONFIG } from "@/lib/points";

export async function createPost(content: string, communityId?: string, parentId?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorId: userId,
        communityId,
        parentId,
      }
    });

    // Award points
    await awardPoints(userId, parentId ? POINTS_CONFIG.REPLY : POINTS_CONFIG.POST);

    revalidatePath("/");
    if (communityId) revalidatePath(`/community/${communityId}`);
    if (parentId) revalidatePath(`/status/${parentId}`);
    
    return post;
  } catch (e) {
    console.error("CREATE_POST_ERROR:", e);
    throw e;
  }
}

export async function reactToPost(postId: string, type: "FUCK_YOU" | "HATE" | "BASED" | "L") {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  try {
    const existing = await prisma.reaction.findUnique({
      where: {
        userId_postId: { userId, postId }
      }
    });

    if (existing) {
      if (existing.type === type) {
        await prisma.reaction.delete({ where: { id: existing.id } });
      } else {
        await prisma.reaction.update({
          where: { id: existing.id },
          data: { type }
        });
      }
    } else {
      await prisma.reaction.create({
        data: { userId, postId, type }
      });
      // Award points for reacting
      await awardPoints(userId, POINTS_CONFIG.REACTION);
    }

    revalidatePath("/");
    revalidatePath(`/status/${postId}`);
    return { success: true };
  } catch (e) {
    console.error("REACTION_ERROR:", e);
    return { success: false };
  }
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
