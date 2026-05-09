"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUserStats() {
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
      totalUsers: await prisma.user.count(),
    },
    recentActivity: user.posts,
  };
}

export async function getLeaderboard() {
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
    wallet: `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}`,
    username: user.username,
    points: user.points,
    rank: index + 1,
    label: getLabel(user.points, index + 1)
  }));
}

function getLabel(points: number, rank: number) {
  if (rank === 1) return "SUPREME REBEL";
  if (rank <= 3) return "NIKITA'S NIGHTMARE";
  if (rank <= 10) return "ELITE HATER";
  if (points > 5000) return "BANNED ON X";
  if (points > 1000) return "REBEL";
  return "DEGEN";
}
