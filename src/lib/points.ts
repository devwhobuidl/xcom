import { prisma } from "./prisma";

export const POINTS_CONFIG = {
  POST: 50,
  REPLY: 20,
  REACTION: 10,
  FOLLOW: 15,
  STREAK_BONUS: 1.5,
};

export async function awardPoints(userId: string, action: keyof typeof POINTS_CONFIG) {
  const amount = POINTS_CONFIG[action];

  try {
    await prisma.$transaction([
      // Log the transaction
      prisma.pointTransaction.create({
        data: {
          userId,
          amount,
          reason: action,
        },
      }),
      // Update the user total
      prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: amount,
          },
        },
      }),
    ]);
    return amount;
  } catch (error) {
    console.error("Failed to award points:", error);
    return 0;
  }
}
