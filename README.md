# xcommunity.fun 💀

Official home of the **$XCOM – Fuck You Nikita** rebel community on Solana. 

Built with Next.js 15, Tailwind CSS, and pure rebel energy.

## Features 🚀

- **Funny Wallet Auth**: Sign to prove you aren't Nikita. Experience the roast animation.
- **The Pit (Feed)**: Community-driven content with custom "Fuck You" reactions.
- **Earning System**: Earn Hate Points for posting and reacting.
- **Daily Airdrops**: Automated $XCOM rewards for top active rebels.
- **Leaderboard**: Track the top Nikita haters in the rebellion.
- **Glassmorphism UI**: Dark, gritty, and premium Solana-native aesthetic.

## Tech Stack 🛠️

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js + Solana Wallet Adapter
- **Solana**: @solana/web3.js + @solana/spl-token

## Getting Started 🏁

### 1. Clone & Install
```bash
git clone <your-repo>
cd xcommunity-fun
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in the blanks:
- `DATABASE_URL`: Your Postgres connection string.
- `NEXT_PUBLIC_SOLANA_RPC`: Your Helius/QuickNode/Alchemy RPC URL.
- `TREASURY_PRIVATE_KEY`: Base58 private key of the $XCOM treasury wallet.
- `CRON_SECRET`: Random string for securing the airdrop endpoint.

### 3. Database Setup
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Locally
```bash
npm run dev
```

## Deployment 📦

### Frontend (Vercel)
1. Push your code to GitHub.
2. Import the project to Vercel.
3. Add all environment variables.
4. Set up a **Vercel Cron** to hit `/api/cron/airdrop` daily.

### Database (Railway / Neon)
1. Provision a PostgreSQL instance.
2. Provide the connection string to Vercel.

## Airdrop Logic 💰

The system identifies top active users (points > 500) and processes a batch transfer of $XCOM from the treasury wallet. Logs are stored in the database for transparency.

---
**JOIN THE REBELLION. FUCK NIKITA. $XCOM TO THE MOON.** 🚀💀
