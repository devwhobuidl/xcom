"use server";

import { WebSocketServer } from 'ws';
import { prisma } from '@/lib/prisma';

export async function initChatServer(port: number = 3001) {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws) => {
    console.log('Client connected to chat server');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'CHAT_MESSAGE') {
          const savedMessage = await prisma.chatMessage.create({
            data: {
              content: message.content,
              userId: message.userId,
              communityId: message.communityId,
            },
            include: {
              user: {
                select: {
                  username: true,
                  image: true,
                  walletAddress: true,
                }
              }
            }
          });

          const broadcastData = JSON.stringify({
            type: 'CHAT_MESSAGE',
            ...savedMessage
          });

          wss.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(broadcastData);
            }
          });
        }
      } catch (e) {
        console.error('Chat error:', e);
      }
    });
  });

  return wss;
}
