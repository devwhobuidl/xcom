import { prisma } from "@/lib/prisma";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { CreateCommunityModal } from "@/components/communities/CreateCommunityModal";
import { Users, Search, Filter } from "lucide-react";

export default async function CommunitiesPage() {
  const communities = await prisma.community.findMany({
    orderBy: { memberCount: "desc" },
    include: {
      _count: {
        select: { members: true, posts: true }
      }
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-zinc-900 to-black">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Community Hub</h2>
            <p className="text-white/40 font-mono text-xs uppercase">Find your cell in the rebellion</p>
          </div>
          <CreateCommunityModal />
        </div>

        <div className="flex gap-2">
           <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
             <input 
               type="text" 
               placeholder="Search communities..."
               className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
             />
           </div>
           <button className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4 text-white/50" />
           </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
          {communities.length === 0 && (
            <div className="col-span-full p-20 text-center space-y-4 border-2 border-dashed border-white/5 rounded-3xl">
               <Users className="w-12 h-12 text-white/10 mx-auto" />
               <p className="text-white/40 font-black italic uppercase tracking-widest">No communities found</p>
               <p className="text-white/20 text-sm">Be the first to lead a new rebellion.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
