import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
    CredentialsProvider({
      name: "Solana Wallet",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          walletAddress: user.walletAddress,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "twitter") {
        try {
          const twitterId = user.id;
          const username = (profile as any).data?.username || profile?.name;
          const image = user.image;

          let dbUser = await prisma.user.findUnique({
            where: { walletAddress: `twitter:${twitterId}` },
          });

          if (!dbUser) {
            const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            dbUser = await prisma.user.create({
              data: {
                walletAddress: `twitter:${twitterId}`,
                username: username,
                image: image,
                referralCode,
                points: 100,
                streak: 1,
              },
            });
          }

          (user as any).dbId = dbUser.id;
          (user as any).walletAddress = dbUser.walletAddress;
          return true;
        } catch (error) {
          console.error("Error in Twitter signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = (user as any).dbId || user.id;
        token.walletAddress = (user as any).walletAddress;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).walletAddress = token.walletAddress;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
