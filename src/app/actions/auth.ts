"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string | null;

    if (!username || username.length < 3) {
      return { success: false, error: "Username must be at least 3 characters." };
    }
    
    if (!password || password.length < 8) {
      return { success: false, error: "Secret key must be at least 8 characters." };
    }

    // Check if database is even configured
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
      return { 
        success: false, 
        error: "The rebellion database is offline. Tell the commander to check DATABASE_URL." 
      };
    }

    // Ensure username is unique
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { username },
      });
    } catch (dbError: any) {
      console.error("PRISMA_FIND_ERROR:", dbError);
      if (dbError.message?.includes("Invalid URL")) {
        return { success: false, error: "Database configuration error: Invalid URL. Check Vercel environment variables." };
      }
      return { success: false, error: "Database unreachable. The rebellion is under attack!" };
    }

    if (existingUser) {
      return { success: false, error: "Username already taken by another rebel." };
    }

    // Hash and store
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email: email || null,
        referralCode,
        points: 100,
        streak: 1,
        lastLogin: new Date(),
      },
    });

    return { success: true, user: { id: user.id, username: user.username } };
  } catch (error: any) {
    console.error("SIGNUP_ERROR:", error);
    return { success: false, error: error.message || "Failed to create account." };
  }
}
