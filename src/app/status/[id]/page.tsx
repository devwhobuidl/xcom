import { getPostThread } from "@/app/actions/community";
import { PostCard } from "@/components/feed/PostCard";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ChevronLeft, Skull } from "lucide-react";
import Link from "next/link";

export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostThread(id);
  const session = await getServerSession(authOptions);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 p-4 flex items-center gap-6">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-all group">
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">
            Chaos Thread
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">
            Analyzing the roast
          </p>
        </div>
      </div>
      
      <div className="flex-1 divide-y divide-white/5">
        <div className="bg-gradient-to-b from-white/[0.02] to-transparent">
          <PostCard post={post as any} currentUserId={(session?.user as any)?.id} />
        </div>
        
        {post.replies.length > 0 ? (
          <div className="divide-y divide-white/5">
            {post.replies.map((reply) => (
              <PostCard 
                key={reply.id} 
                post={reply as any} 
                currentUserId={(session?.user as any)?.id} 
                isReply 
              />
            ))}
          </div>
        ) : (
          <div className="p-20 text-center space-y-4">
             <div className="relative inline-block">
                <Skull className="w-12 h-12 text-white/5 mx-auto" />
                <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
             </div>
             <p className="text-white/20 font-black italic uppercase tracking-widest text-xs">No one has replied to this chaos yet...</p>
          </div>
        )}
      </div>
    </div>
  );
}
