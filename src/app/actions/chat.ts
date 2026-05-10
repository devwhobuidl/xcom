"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getOrCreateChannel(name: string = "Global Chaos") {
  try {
    let channel = await prisma.chatChannel.findUnique({
      where: { name }
    });

    if (!channel) {
      channel = await prisma.chatChannel.create({
        data: {
          name,
          description: "The main frequency for the rebellion."
        }
      });
    }

    return channel;
  } catch (error) {
    console.error("GET_OR_CREATE_CHANNEL_ERROR:", error);
    throw error;
  }
}

export async function getChatMessages(channelId: string) {
  try {
    return await prisma.chatMessage.findMany({
      where: { channelId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
            walletAddress: true,
            points: true
          }
        }
      }
    });
  } catch (error) {
    console.error("GET_CHAT_MESSAGES_ERROR:", error);
    return [];
  }
}

export async function sendChatMessage(channelId: string, content: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const userId = (session.user as any).id;

    const message = await prisma.chatMessage.create({
      data: {
        content,
        channelId,
        userId
      },
      include: {
        user: true
      }
    });

    return { success: true, message };
  } catch (error) {
    console.error("SEND_CHAT_MESSAGE_ERROR:", error);
    throw error;
  }
}
