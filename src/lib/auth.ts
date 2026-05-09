import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import TwitterProvider from "next-auth/providers/twitter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import nacl from "tweetnacl";
import bs58 from "bs58";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0",
    }),
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
        publicKey: { label: "Public Key", type: "text" },
        referral: { label: "Referral", type: "text" },
      },
      async authorize(credentials) {
        try {
          const { message, signature, publicKey } = credentials || {};
          if (!message || !signature || !publicKey) return null;

          const msgUint8 = Buffer.from(message);
          const sigUint8 = bs58.decode(signature);
          const pubKeyUint8 = bs58.decode(publicKey);

          console.log("🔐 Verifying signature...", {
            publicKey,
            messagePreview: message.substring(0, 30) + "...",
            sigLength: sigUint8.length,
            msgLength: msgUint8.length,
          });

          const isValid = nacl.sign.detached.verify(
            msgUint8,
            sigUint8,
            pubKeyUint8
          );
          
          if (!isValid) {
            console.error("❌ Signature verification failed!", {
              publicKey,
              messageContent: message,
              sigLength: sigUint8.length,
              msgLength: msgUint8.length,
            });
            return null;
          }
          
          console.log("✅ Signature valid! Fetching user from DB...");
          
          try {
            let user = await prisma.user.findUnique({
              where: { walletAddress: publicKey },
            });

            if (!user) {
              console.log("🆕 New user! Creating account for:", publicKey);
              const referredByCode = (credentials as any).referral;
              let referrerId = null;
              
              if (referredByCode) {
                const referrer = await prisma.user.findUnique({
                  where: { referralCode: referredByCode }
                });
                if (referrer) {
                  referrerId = referrer.id;
                  await prisma.user.update({
                    where: { id: referrer.id },
                    data: { points: { increment: 500 } }
                  });
                }
              }

              const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
              user = await prisma.user.create({
                data: {
                  walletAddress: publicKey,
                  referralCode,
                  referredBy: referredByCode || null,
                  points: 100,
                  streak: 1,
                  lastLogin: new Date(),
                },
              });
            } else {
              console.log("👋 Welcome back user:", user.id);
              await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() },
              });
            }

            return {
              id: user.id,
              name: user.username || publicKey.slice(0, 4) + "..." + publicKey.slice(-4),
              image: null,
              walletAddress: publicKey,
            };
          } catch (dbError: any) {
            console.error("🚨 Database error during auth:", dbError.message);
            // We return null so NextAuth handles it as a sign-in failure, 
            // but the server log will show the real reason.
            return null;
          }
        } catch (e: any) {
          console.error("🏁 Auth process failed:", e.message);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "username-login",
      name: "Username Login",
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

          // Check if user exists by twitterId (we'll use walletAddress as a placeholder or add a twitterId field)
          // For now, let's look by walletAddress if it exists, or create a new user.
          // IMPORTANT: The schema currently uses walletAddress as unique.
          // If they login with Twitter, they might not have a wallet yet.
          // Let's use the twitterId as a pseudo-walletAddress or add a field.
          
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

          // Attach the DB id to the user object so it's available in the jwt callback
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
