import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, MessageSquare, Heart, UserPlus, Zap, Skull } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <div>Unauthorized</div>;

  const notifications = await prisma.notification.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <h2 className="text-xl font-black italic uppercase tracking-tighter">Notifications</h2>
      </div>

      <div className="flex-1 divide-y divide-white/5">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-4 flex gap-4 transition-colors hover:bg-white/[0.02] ${!notif.read ? "bg-primary/5" : ""}`}>
             <div className="shrink-0 pt-1">
                {notif.type === "REACTION" && <Heart className="w-6 h-6 text-primary fill-primary" />}
                {notif.type === "REPLY" && <MessageSquare className="w-6 h-6 text-blue-500" />}
                {notif.type === "FOLLOW" && <UserPlus className="w-6 h-6 text-purple-500" />}
                {notif.type === "AIRDROP" && <Skull className="w-6 h-6 text-yellow-500" />}
             </div>
             <div className="flex-1 space-y-1">
                <p className="text-sm text-white/90 leading-relaxed">
                  {notif.content}
                </p>
                <p className="text-xs text-white/30 font-mono">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </p>
             </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="text-4xl">🦗</div>
             <p className="text-white/40 font-black italic uppercase tracking-widest">Silence in the pit...</p>
             <p className="text-white/20 text-sm">No one is roasting or loving you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
