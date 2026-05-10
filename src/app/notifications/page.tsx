export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, UserPlus, Zap, Repeat2, ArrowLeft, Settings2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { NotificationsClient } from "@/components/notifications/NotificationsClient";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user) {
    redirect("/");
  }

  console.log("NotificationsPage: User found in DB:", user.username || user.walletAddress);

  let notifications = [];
  try {
    notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        issuer: {
          select: {
            id: true,
            username: true,
            image: true,
            walletAddress: true,
            points: true,
          }
        },
        post: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                walletAddress: true,
                points: true,
              }
            },
            reactions: true,
            _count: {
              select: {
                reactions: true,
                replies: true,
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("NOTIFICATIONS_PAGE_FETCH_ERROR:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-all group">
            <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-white group-hover:-translate-x-1 transition-all" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">Notifications</h1>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 leading-none mt-1.5">The rebellion is active</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-2.5 hover:bg-white/5 rounded-xl transition-all group border border-transparent hover:border-white/10"
            title="Notification Settings"
          >
            <Settings2 className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      <NotificationsClient 
        initialNotifications={notifications as any} 
        currentUserId={user.id}
      />
    </div>
  );
}
