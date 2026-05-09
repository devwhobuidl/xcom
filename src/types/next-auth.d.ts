import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      walletAddress: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    walletAddress: string;
    dbId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    walletAddress: string;
  }
}
