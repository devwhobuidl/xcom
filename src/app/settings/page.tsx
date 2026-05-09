import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Settings, Shield, User, Lock, Trash2, Bell, Smartphone, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user) redirect("/");

  const settingsSections = [
    {
      title: "Account Information",
      icon: User,
      description: "Manage your profile identity and public persona.",
      items: [
        { label: "Username", value: user.username || "Not set", action: "Change" },
        { label: "Wallet", value: `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`, action: "Copy" },
        { label: "Bio", value: user.bio || "No bio set", action: "Edit" },
      ]
    },
    {
      title: "Security",
      icon: Lock,
      description: "Protect your account and managed connected devices.",
      items: [
        { label: "Two-Factor Auth", value: "Disabled", action: "Enable" },
        { label: "Connected Apps", value: "None", action: "Manage" },
      ]
    },
    {
      title: "Privacy",
      icon: Shield,
      description: "Control who sees your activity and roasts.",
      items: [
        { label: "Profile Visibility", value: "Public", action: "Change" },
        { label: "Direct Messages", value: "Everyone", action: "Restrict" },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-8 border-b border-white/10 bg-zinc-900/50">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Command Center
        </h2>
        <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-1">Configure your tactical setup</p>
      </div>

      <div className="p-6 space-y-8 pb-20">
        {settingsSections.map((section) => (
          <div key={section.title} className="space-y-4">
            <div className="flex items-center gap-2">
              <section.icon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white/80">{section.title}</h3>
            </div>
            
            <div className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <p className="text-xs text-white/40 font-mono italic">{section.description}</p>
              </div>
              
              <div className="divide-y divide-white/5">
                {section.items.map((item) => (
                  <div key={item.label} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-white/30 mb-0.5">{item.label}</div>
                      <div className="text-sm font-medium text-white/80">{item.value}</div>
                    </div>
                    <button className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all">
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-8 border-t border-white/5">
          <button className="w-full p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 flex items-center justify-between transition-all group">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5" />
              <div className="text-left">
                <div className="font-black uppercase tracking-tighter">Decommission Account</div>
                <div className="text-[10px] opacity-50 font-mono">This action is permanent and irreversible.</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
