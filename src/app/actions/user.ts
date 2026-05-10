"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { awardPoints } from "@/lib/points";

export async function getUserStats() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          }
        },
        posts: {
          orderBy: { createdAt: "desc" },
          take: 6,
          include: {
            _count: {
              select: {
                reactions: true,
                replies: true,
              }
            }
          }
        },
      }
    });

    if (!user) return null;

    // Calculate specific counts
    const totalPosts = await prisma.post.count({
      where: { authorId: userId, parentId: null }
    });

    const totalReplies = await prisma.post.count({
      where: { authorId: userId, NOT: { parentId: null } }
    });

    const totalRoastsGiven = await prisma.reaction.count({
      where: { userId: userId, type: "FUCK_YOU" }
    });

    const totalRoastsReceived = await prisma.reaction.count({
      where: { post: { authorId: userId }, type: "FUCK_YOU" }
    });

    // Simple rank calculation based on points
    const allUsersCount = await prisma.user.count();
    const higherPointUsers = await prisma.user.count({
      where: { points: { gt: user.points } }
    });
    const rank = higherPointUsers + 1;

    return {
      user: {
        ...user,
        rank,
      },
      counts: {
        posts: totalPosts,
        replies: totalReplies,
        roastsGiven: totalRoastsGiven,
        roastsReceived: totalRoastsReceived,
        totalUsers: allUsersCount,
      },
      recentActivity: user.posts,
    };
  } catch (error) {
    console.error("GET_USER_STATS_ERROR:", error);
    return null;
  }
}

export async function getLeaderboard() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        points: 'desc',
      },
      take: 50,
      select: {
        walletAddress: true,
        username: true,
        points: true,
      }
    });

    return users.map((user, index) => ({
      wallet: user.walletAddress 
        ? `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}`
        : (user.username || "ANON"),
      username: user.username,
      points: user.points,
      rank: index + 1,
      label: getLabel(user.points, index + 1)
    }));
  } catch (error) {
    console.error("GET_LEADERBOARD_ERROR:", error);
    return [];
  }
}

function getLabel(points: number, rank: number) {
  if (rank === 1) return "GOD OF CHAOS";
  if (rank <= 3) return "LEGENDARY HATER";
  if (rank <= 10) return "ELITE REBEL";
  if (points > 5000) return "VETERAN";
  return "REBEL";
}

export async function followUser(followingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const followerId = (session.user as any).id;
    if (followerId === followingId) throw new Error("Can't follow yourself, narcissist.");

    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: "FOLLOW",
        userId: followingId,
        issuerId: followerId,
      },
    });

    await awardPoints(followerId, "FOLLOW");
    revalidatePath(`/profile/${followingId}`);
    return { success: true };
  } catch (error) {
    console.error("FOLLOW_USER_ERROR:", error);
    throw error;
  }
}

export async function unfollowUser(followingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const followerId = (session.user as any).id;

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    revalidatePath(`/profile/${followingId}`);
    return { success: true };
  } catch (error) {
    console.error("UNFOLLOW_USER_ERROR:", error);
    throw error;
  }
}

export async function updateProfile(data: { username?: string; bio?: string; image?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  try {
    const userId = (session.user as any).id;

    // If username is being updated, check if it's already taken
    if (data.username) {
      const existing = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (existing && existing.id !== userId) {
        throw new Error("Username already taken by another rebel.");
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    revalidatePath("/profile");
    revalidatePath(`/profile/${user.username || user.id}`);
    return user;
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR:", error);
    throw error;
  }
}
