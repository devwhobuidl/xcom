"use client";

import React, { useState } from "react";
import { updateProfile } from "@/app/actions/user";
import { toast } from "sonner";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditProfileModalProps {
  user: any;
  onClose: () => void;
}

export const EditProfileModal = ({ user, onClose }: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    username: user.username || "",
    bio: user.bio || "",
    image: user.image || "",
    bannerImage: user.bannerImage || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Profile updated! Nikita is seething.");
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update profile. Rebellion suppressed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-primary">Edit Identity</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Alias</Label>
            <Input 
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className="bg-black border-white/10 rounded-xl h-12 font-bold"
              placeholder="Your rebel name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Manifesto (Bio)</Label>
            <Textarea 
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="bg-black border-white/10 rounded-xl min-h-[100px] resize-none"
              placeholder="Why are you here?"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-full bg-white text-black font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
          >
            {loading ? "Syncing..." : "Update Rebel Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};
