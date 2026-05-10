"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string | null;

    if (!username || !password) {
      return { success: false, error: "Username and password are required." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { success: false, error: "Username already taken by another rebel." };
    }

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
