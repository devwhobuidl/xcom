"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Users, Terminal, Skull } from "lucide-react";
import { toast } from "sonner";
import { createCommunity } from "@/app/actions/community";
import { useRouter } from "next/navigation";

export function CreateCommunityModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const res = await createCommunity({ name, slug, description });
      if (res.success) {
        toast.success("Community founded! The rebellion grows. 💀");
        setOpen(false);
        const community = (res as any).community;
        router.push(`/community/${community.slug}`);
      } else {
        toast.error((res as any).error || "Failed to found community.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <Plus className="w-3 h-3" /> Found Clan
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-black border-white/10 p-0 overflow-hidden rounded-[2rem]">
        <div className="h-32 bg-gradient-to-br from-primary/30 to-black p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="relative z-10 flex flex-col justify-end h-full">
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">New Sector</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter text-white">FOUND A CLAN</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Clan Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="The Nikita Roasters"
                required
                className="bg-white/[0.03] border-white/10 rounded-xl py-6 font-mono text-white placeholder:text-white/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Manifesto</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What is the purpose of this sector? Who are we roasting today?"
                className="bg-white/[0.03] border-white/10 rounded-xl min-h-[100px] font-medium text-white placeholder:text-white/20"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-black uppercase tracking-[0.2em] py-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
          >
            {loading ? "Mobilizing..." : "Found the Clan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
