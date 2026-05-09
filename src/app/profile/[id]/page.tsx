import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostCard } from "@/components/feed/PostCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: { posts: true, followers: true, following: true }
      },
      posts: {
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          reactions: true,
          _count: { select: { reactions: true, replies: true } }
        }
      }
    }
  });

  if (!user) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen">
      <ProfileHeader user={user} />
      <div className="flex-1 divide-y divide-white/5 mt-4">
        {user.posts.map((post) => (
          <PostCard key={post.id} post={post as any} currentUserId={(session?.user as any)?.id} />
        ))}
        {user.posts.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="text-4xl">🦗</div>
             <p className="text-white/40 font-black italic uppercase tracking-widest text-sm">This rebel is quiet...</p>
          </div>
        )}
      </div>
    </div>
  );
}
