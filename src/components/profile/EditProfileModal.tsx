"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Skull, Terminal } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/user";
import { useRouter } from "next/navigation";

interface EditProfileModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal = ({ user, isOpen, onClose }: EditProfileModalProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: user.username || "",
    bio: user.bio || "",
    image: user.image || "",
    bannerImage: user.bannerImage || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success("Identity updated. Nikita is confused. 💀");
      onClose();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update identity. The system is fighting back.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-black border-white/10 p-0 overflow-hidden rounded-[2rem]">
        <div className="relative h-32 bg-gradient-to-br from-primary/30 to-black">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute bottom-4 left-8 flex items-center gap-3">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Update Manifest</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Handle</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="rebel_name"
                className="bg-white/[0.03] border-white/10 rounded-xl py-6 font-mono text-white placeholder:text-white/20"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio" className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Manifesto (Bio)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="What is your cause?"
                className="bg-white/[0.03] border-white/10 rounded-xl min-h-[100px] font-medium text-white placeholder:text-white/20"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Imagery</Label>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Avatar URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="bg-white/[0.03] border-white/10 rounded-xl font-mono text-xs text-white"
                  />
                  <Input
                    placeholder="Banner URL"
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    className="bg-white/[0.03] border-white/10 rounded-xl font-mono text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-white/5 border-white/10 text-white/40 font-black uppercase tracking-widest py-6 rounded-2xl hover:text-white"
            >
              Abort
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white font-black uppercase tracking-widest py-6 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {loading ? "SAVING..." : "COMMIT"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
