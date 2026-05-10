import React from "react";
import { Shield, Users, MessageSquare, Zap, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let userCount = 0;
  let postCount = 0;
  let totalPoints = { _sum: { points: 0 } };
  let recentLogs = [];

  try {
    userCount = await prisma.user.count();
    postCount = await prisma.post.count();
    totalPoints = await (prisma.user.aggregate({ _sum: { points: true } }) as any);
    recentLogs = await prisma.airdropLog.findMany({ take: 5, orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error("ADMIN_PAGE_FETCH_ERROR:", error);
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black italic flex items-center gap-3">
          <Shield className="w-10 h-10 text-primary" />
          COMMAND CENTER
        </h1>
        <div className="bg-primary/20 px-4 py-1 border border-primary/50 text-xs font-mono text-primary uppercase animate-pulse">
          Admin Session Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass p-6 border-white/10 space-y-2">
          <div className="flex justify-between">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-mono opacity-50">USERS</span>
          </div>
          <div className="text-4xl font-black">{userCount}</div>
          <div className="text-xs text-muted-foreground uppercase">Active Rebels</div>
        </Card>
        <Card className="glass p-6 border-white/10 space-y-2">
          <div className="flex justify-between">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-mono opacity-50">POSTS</span>
          </div>
          <div className="text-4xl font-black">{postCount}</div>
          <div className="text-xs text-muted-foreground uppercase">Total Roasts</div>
        </Card>
        <Card className="glass p-6 border-white/10 space-y-2">
          <div className="flex justify-between">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-mono opacity-50">ECONOMY</span>
          </div>
          <div className="text-4xl font-black">{totalPoints._sum.points || 0}</div>
          <div className="text-xs text-muted-foreground uppercase">Points Circulating</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-primary/30 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-primary/5">
            <h3 className="font-black italic flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              AIRDROP CONTROL
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex gap-4">
              <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
              <p className="text-xs text-red-200 font-mono">
                Manual airdrop will distribute tokens to the top 20 haters immediately. This action is IRREVERSIBLE on-chain.
              </p>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/80 text-white font-black py-6 rounded-2xl text-lg italic">
              TRIGGER MANUAL AIRDROP
            </Button>
            
            <div className="space-y-3">
              <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Recent Airdrops</h4>
              {recentLogs.map((log, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="font-mono text-xs">{log.signature.slice(0, 12)}...</div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">{log.amount} $XCOM</div>
                    <div className="text-[10px] opacity-50">{new Date(log.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="glass border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="font-black italic">CONTENT MODERATION</h3>
          </div>
          <div className="p-6 flex items-center justify-center h-[300px] text-muted-foreground italic text-sm">
            No pending reports. The pit is civil (for once).
          </div>
        </Card>
      </div>
    </div>
  );
}
