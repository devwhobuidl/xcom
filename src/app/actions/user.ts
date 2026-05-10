"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserProfile(usernameOrId: string) {
  return await prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrId },
        { id: usernameOrId },
        { walletAddress: usernameOrId }
      ]
    },
    include: {
      posts: {
        take: 20,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          reactions: true,
          _count: {
            select: { reactions: true, replies: true },
          }
        }
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        }
      }
    }
  });
}

export async function getLeaderboard() {
  return await prisma.user.findMany({
    take: 100,
    orderBy: { points: "desc" },
    select: {
      id: true,
      username: true,
      walletAddress: true,
      image: true,
      points: true,
      rank: true,
    }
  });
}

export async function followUser(followingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const followerId = (session.user as any).id;

  if (followerId === followingId) throw new Error("You can't follow yourself, narcissist.");

  try {
    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      }
    });

    revalidatePath(`/profile/${followingId}`);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function unfollowUser(followingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const followerId = (session.user as any).id;

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        }
      }
    });

    revalidatePath(`/profile/${followingId}`);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function updateProfile(data: { username?: string, bio?: string, image?: string, bannerImage?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      username: data.username,
      bio: data.bio,
      image: data.image,
      bannerImage: data.bannerImage,
    }
  });

  revalidatePath(`/profile/${userId}`);
  return updatedUser;
}
