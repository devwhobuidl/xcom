import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🚀 Seeding default communities...')

  const communities = [
    {
      name: 'Nikita Haters Club',
      slug: 'nikita-haters',
      description: 'The original sanctuary for those wronged by the master of chaos. We roast, we meme, we rebel.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nikita',
      banner: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
    },
    {
      name: 'Solana Chads',
      slug: 'solana-chads',
      description: 'The fastest degens in the west. High speed, low fees, maximum chaos. $XCOM to the moon.',
      avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Solana',
      banner: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2064&auto=format&fit=crop',
    },
    {
      name: 'The Airdrop Mafia',
      slug: 'airdrop-mafia',
      description: 'Hunting every last $XCOM drop. Tactics, timing, and pure greed.',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mafia',
      banner: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop',
    },
    {
      name: 'Meme Lords',
      slug: 'meme-lords',
      description: 'If it ain\'t funny, it ain\'t rebellion. The creative engine of the XCOM movement.',
      avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Meme',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    }
  ]

  for (const community of communities) {
    await prisma.community.upsert({
      where: { slug: community.slug },
      update: {},
      create: {
        ...community,
        memberCount: 0,
      },
    })
    console.log(`✅ Community created: ${community.name}`)
  }

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
