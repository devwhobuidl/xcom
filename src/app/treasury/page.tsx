import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { Wallet, Info, ArrowUpRight, CheckCircle2, AlertCircle, History } from "lucide-react";

export default async function TreasuryPage() {
  const recentDrops = await prisma.airdropLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8 border-b border-white/10 bg-gradient-to-br from-zinc-900 to-black">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">The War Chest</h2>
            <p className="text-white/50 font-mono text-sm max-w-md leading-relaxed">
              Every $XCOM token here is destined for the pockets of the community.
              We don't hold. We distribute.
            </p>
          </div>
          <div className="p-4 bg-primary/20 border border-primary/40 rounded-3xl text-center">
             <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Status</div>
             <div className="flex items-center gap-2 text-primary font-black italic">
                <CheckCircle2 className="w-4 h-4" /> REFILLING
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-black border border-white/10 rounded-3xl space-y-2">
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Available to Airdrop</div>
            <div className="text-4xl font-black italic text-white tracking-tighter">6,942,000 $XCOM</div>
            <div className="text-xs font-mono text-white/30 uppercase">~ $2,915.64 USD</div>
          </div>
          <div className="p-6 bg-black border border-white/10 rounded-3xl space-y-2">
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest">Total Distributed</div>
            <div className="text-4xl font-black italic text-primary tracking-tighter">420.69M $XCOM</div>
            <div className="text-xs font-mono text-white/30 uppercase">To 12,450 Unique Rebels</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tighter italic flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" /> How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Roast", desc: "Post high-quality roasts of Nikita to earn Hate Points." },
              { title: "Engage", desc: "Interact with the community. Every action earns points." },
              { title: "Get Paid", desc: "Every 24h, the treasury is split among the top hater points." },
            ].map((step, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="absolute -top-2 -right-2 text-4xl font-black italic opacity-5 group-hover:opacity-10 transition-opacity italic">{i+1}</div>
                <div className="font-bold text-white mb-1">{step.title}</div>
                <div className="text-xs text-white/50 leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase tracking-tighter italic flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Recent Airdrops
          </h3>
          <div className="border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/5">
            {recentDrops.map((drop) => (
              <div key={drop.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{drop.amount.toLocaleString()} $XCOM</div>
                    <div className="text-[10px] text-white/30 font-mono uppercase">{drop.recipientCount} Recipients</div>
                  </div>
                </div>
                <div className="text-right">
                  <a 
                    href={`https://solscan.io/tx/${drop.signature}`}
                    target="_blank"
                    className="text-[10px] font-mono text-primary hover:underline uppercase"
                  >
                    View TX
                  </a>
                  <div className="text-[10px] text-white/20 uppercase">{new Date(drop.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
            {recentDrops.length === 0 && (
              <div className="p-12 text-center text-white/20 italic font-mono flex flex-col items-center gap-3">
                <AlertCircle className="w-8 h-8 opacity-20" />
                The rebellion is just beginning. No airdrops yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
