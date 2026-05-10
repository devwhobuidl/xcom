import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import TwitterProvider from "next-auth/providers/twitter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import nacl from "tweetnacl";
import bs58 from "bs58";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p", // Fallback for local, but production MUST have it
  debug: process.env.NODE_ENV === 'development',
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
              dbId: user.id, // Explicitly add dbId to match JWT callback expectation
            };
          } catch (dbError: any) {
            console.error("🚨 [NEXTAUTH] Database error during Solana auth:", dbError.message);
            return null;
          }
        } catch (e: any) {
          console.error("🏁 [NEXTAUTH] Solana auth process failed:", e.message);
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

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          });

          if (!user || !user.password) {
            console.warn(`🕵️ Login attempt failed: User ${credentials.username} not found.`);
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            console.warn(`🕵️ Login attempt failed: Incorrect password for ${credentials.username}.`);
            return null;
          }

          console.log(`✅ [NEXTAUTH] User ${credentials.username} authenticated successfully.`);
          return {
            id: user.id,
            name: user.username,
            walletAddress: user.walletAddress,
            dbId: user.id, // Explicitly add dbId
          };
        } catch (error: any) {
          console.error("🚨 [NEXTAUTH] AUTH_USERNAME_LOGIN_ERROR:", error.message);
          if (error.message?.includes("Invalid URL")) {
            throw new Error("Database configuration error. Check DATABASE_URL.");
          }
          throw new Error("The rebellion database is acting up. Try again.");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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

          (user as any).id = dbUser.id; // Ensure user.id is the database ID for the next steps
          return true;
        } catch (error) {
          console.error("Error in Twitter signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
};
