"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Skull, Info } from "lucide-react";
import { createCommunity } from "@/app/actions/community";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateCommunityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const community = await createCommunity({
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        description: formData.get("description") as string,
      });
      
      toast.success("Clan created! Rebellion expanding. 🔥");
      setIsOpen(false);
      router.push(`/community/${community.slug}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create clan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-white text-black font-black uppercase tracking-widest text-xs px-6 py-5 hover:scale-105 transition-all shadow-xl gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Clan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-white/10 text-white sm:max-w-[425px] overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10" />
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
               <Skull className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Start a Rebellion</DialogTitle>
          </div>
          <p className="text-xs text-white/40 font-medium">Gather your squad and roast Nikita together.</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Clan Name</label>
              <Input 
                name="name" 
                placeholder="e.g. Nikita's Nightmare" 
                required 
                className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Slug (URL)</label>
              <div className="relative">
                <Input 
                  name="slug" 
                  placeholder="nikitas-nightmare" 
                  required 
                  className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 pl-4"
                />
              </div>
              <p className="text-[9px] text-white/20 flex items-center gap-1">
                <Info className="w-3 h-3" />
                xcommunity.fun/community/[slug]
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Description</label>
              <Textarea 
                name="description" 
                placeholder="What is this rebellion about?" 
                className="bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/10 min-h-[100px]"
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
