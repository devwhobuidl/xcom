/**
 * LEGACY CHAT SERVER (Socket.io)
 * Temporarily disabled for Vercel deployment stability.
 * We will bring this back with Supabase Realtime in the next update.
 */

/*
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { prisma } from '../lib/prisma';

export async function initChatServer(port: number = 3001) {
  const app = express();
  app.use(cors());

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Adjust for production
      methods: ["GET", "POST"]
    }
  });

  const CHANNELS = ['general', 'airdrops', 'memes', 'dev-talk', 'raids'];
  const onlineUsers = new Map<string, Set<string>>();

  console.log('Initializing chat channels...');
  for (const name of CHANNELS) {
    try {
      await prisma.chatChannel.upsert({
        where: { name },
        update: {},
        create: { name, description: `Official ${name} channel` }
      });
    } catch (err) {
      console.error(`Failed to init channel ${name}:`, err);
    }
  }

  io.on('connection', (socket) => {
    let currentUserId: string | null = null;
    let currentChannel: string | null = null;

    socket.on('join', async ({ channel, userId, username }) => {
      if (currentChannel) socket.leave(currentChannel);
      
      socket.join(channel);
      currentUserId = userId;
      currentChannel = channel;

      if (!onlineUsers.has(channel)) onlineUsers.set(channel, new Set());
      onlineUsers.get(channel)?.add(userId);

      console.log(`User ${username} (${userId}) joined channel ${channel}`);
      
      const messages = await prisma.chatMessage.findMany({
        where: { channel: { name: channel } },
        include: { user: { select: { id: true, username: true, image: true, walletAddress: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      
      socket.emit('history', messages.reverse());
      io.to(channel).emit('online_count', onlineUsers.get(channel)?.size || 0);
    });

    socket.on('message', async (data) => {
      const { channel, userId, content } = data;
      
      try {
        if (content.startsWith('/')) {
          await handleCommand(socket, channel, content);
          return;
        }

        const message = await prisma.chatMessage.create({
          data: {
            content,
            user: { connect: { id: userId } },
            channel: { connect: { name: channel } }
          },
          include: { user: { select: { id: true, username: true, image: true, walletAddress: true } } }
        });
        
        io.to(channel).emit('message', message);
      } catch (err) {
        console.error('Failed to save message:', err);
      }
    });

    socket.on('typing', ({ channel, username, isTyping }) => {
      socket.to(channel).emit('user_typing', { username, isTyping });
    });

    socket.on('disconnect', () => {
      if (currentChannel && currentUserId) {
        onlineUsers.get(currentChannel)?.delete(currentUserId);
        io.to(currentChannel).emit('online_count', onlineUsers.get(currentChannel)?.size || 0);
      }
    });
  });

  async function handleCommand(socket: any, channel: string, content: string) {
    const [cmd, ...args] = content.split(' ');
    
    if (cmd === '/price') {
      socket.emit('message', {
        id: 'system-' + Date.now(),
        content: 'Current $XCOM Price: $0.0042 (Live from Airdropper Bot) 🚀',
        system: true,
        createdAt: new Date(),
        user: { username: 'System Bot', image: '/bot-avatar.png' }
      });
    } else if (cmd === '/airdrop') {
      socket.emit('message', {
        id: 'system-' + Date.now(),
        content: 'Checking eligibility for Chaos Drop... 🧪',
        system: true,
        createdAt: new Date(),
        user: { username: 'System Bot', image: '/bot-avatar.png' }
      });
    }
  }

  httpServer.listen(port, () => {
    console.log(`[XCOM CHAT] Server active on port ${port}`);
  });

  return io;
}
*/
