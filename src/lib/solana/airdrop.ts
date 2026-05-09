import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, createTransferInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import bs58 from "bs58";
import { prisma } from "../prisma";

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const XCOM_MINT = new PublicKey(process.env.NEXT_PUBLIC_XCOM_MINT || "11111111111111111111111111111111");
const connection = new Connection(RPC_URL, "confirmed");

export async function processDailyAirdrop() {
  if (!process.env.TREASURY_SECRET_KEY) {
    throw new Error("TREASURY_SECRET_KEY not configured");
  }

  const treasuryKeypair = Keypair.fromSecretKey(
    bs58.decode(process.env.TREASURY_SECRET_KEY)
  );

  // 1. Get active users with points > 0
  const activeUsers = await prisma.user.findMany({
    where: { points: { gt: 0 } },
    select: { id: true, walletAddress: true, points: true }
  });

  if (activeUsers.length === 0) return { success: true, message: "No active users to drop to." };

  const totalPoints = activeUsers.reduce((sum, u) => sum + u.points, 0);
  const totalDropAmount = 1000000; // 1M XCOM tokens total for the drop

  console.log(`Starting airdrop for ${activeUsers.length} users. Total points: ${totalPoints}`);

  let successfulDrops = 0;
  let totalDropped = 0;

  for (const user of activeUsers) {
    try {
      const recipientPubKey = new PublicKey(user.walletAddress);
      const amountPerUser = Math.floor((user.points / totalPoints) * totalDropAmount);
      
      if (amountPerUser <= 0) continue;

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        treasuryKeypair,
        XCOM_MINT,
        treasuryKeypair.publicKey
      );

      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        treasuryKeypair,
        XCOM_MINT,
        recipientPubKey
      );

      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount.address,
          toTokenAccount.address,
          treasuryKeypair.publicKey,
          amountPerUser,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const signature = await sendAndConfirmTransaction(connection, transaction, [treasuryKeypair]);
      
      successfulDrops++;
      totalDropped += amountPerUser;

      await prisma.airdropLog.create({
        data: {
          amount: amountPerUser,
          recipientCount: 1,
          signature,
        }
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { points: 0 }
      });

    } catch (error) {
      console.error(`Failed drop to ${user.walletAddress}:`, error);
    }
  }

  return {
    success: true,
    recipients: successfulDrops,
    totalDropped
  };
}
