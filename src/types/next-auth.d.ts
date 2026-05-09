export type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      walletAddress?: string;
      username?: string;
      points?: number;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    walletAddress?: string;
    username?: string;
    points?: number;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    walletAddress?: string;
    username?: string;
    role?: string;
  }
}
