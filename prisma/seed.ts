import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding the rebellion...')

  // Clear existing data (optional but good for a fresh start in dev)
  // await prisma.notification.deleteMany()
  // await prisma.follow.deleteMany()
  // await prisma.post.deleteMany()
  // await prisma.user.deleteMany()

  const rebels = [
    { wallet: 'OG_REBEL_WALLET', username: 'The_Ungovernable', bio: 'Living rent free in Nikita\'s head since 2021.' },
    { wallet: 'WHALE_REBEL', username: 'XCOM_Chad', bio: 'My bags are heavier than your ego, Nikita.' },
    { wallet: 'MEME_LORD', username: 'PepeTheRebel', bio: 'Memes are the only law I follow.' },
    { wallet: 'DEV_HATERS', username: 'SolanaSleuth', bio: 'Tracing every dev tax back to the source.' },
  ]

  const createdUsers = []

  for (const r of rebels) {
    const user = await prisma.user.upsert({
      where: { walletAddress: r.wallet },
      update: {},
      create: {
        walletAddress: r.wallet,
        username: r.username,
        bio: r.bio,
        points: Math.floor(Math.random() * 5000),
        referralCode: `REF_${r.username.toUpperCase()}`,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.username}`,
        bannerImage: `https://picsum.photos/seed/${r.username}/1200/400`,
      },
    })
    createdUsers.push(user)
  }

  // Follow system
  for (let i = 0; i < createdUsers.length; i++) {
    const follower = createdUsers[i]
    const following = createdUsers[(i + 1) % createdUsers.length]
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: follower.id,
          followingId: following.id,
        }
      },
      update: {},
      create: {
        followerId: follower.id,
        followingId: following.id,
      }
    })
  }

  // Seed some funny posts
  const roasts = [
    { content: "Nikita probably drinks orange juice right after brushing his teeth. Absolute psychopath behavior. #FuckNikita", author: 0 },
    { content: "I heard $XCOM is the only token Nikita hasn't tried to tax yet. He's scared. 📉", author: 1 },
    { content: "Just saw a dev tax higher than my electricity bill. We need the rebellion more than ever. $XCOM", author: 2 },
    { content: "Wait, people actually listen to Nikita's financial advice? I thought it was a parody account. 🤡", author: 3 },
  ]

  for (const roast of roasts) {
    const post = await prisma.post.create({
      data: {
        content: roast.content,
        authorId: createdUsers[roast.author].id,
      },
    })

    // Add a reply
    await prisma.post.create({
      data: {
        content: "LMAO true. He's actually cooked. 💀",
        authorId: createdUsers[(roast.author + 1) % 4].id,
        parentId: post.id,
      }
    })
  }

  console.log('Rebellion seeded successfully! Nikita is shaking.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
