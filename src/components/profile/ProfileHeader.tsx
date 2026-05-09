"use client";

import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/app/actions/user";
import { toast } from "sonner";
import { Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ProfileHeader = ({ user }: { user: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username || "",
    bio: user.bio || "",
    image: user.image || "",
    bannerImage: user.bannerImage || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "bannerImage") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large! Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      toast.success("Profile updated! Nikita can't stop us.");
      setIsEditing(false);
      window.location.reload(); // Simple refresh to show changes
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative h-48 bg-zinc-900 border-b border-white/5">
        {user.bannerImage && (
          <img src={user.bannerImage} className="w-full h-full object-cover" alt="Banner" />
        )}
        <div className="absolute -bottom-16 left-6">
          <Avatar className="w-32 h-32 border-4 border-black rounded-full">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback className="bg-secondary text-primary text-4xl font-black">
              {user.username?.slice(0, 2) || user.walletAddress.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="mt-4 px-6 flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(true)}
          className="rounded-full font-black uppercase text-xs tracking-widest border-white/20 hover:border-primary/50 hover:text-primary transition-all px-6"
        >
          Edit Profile
        </Button>
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-black uppercase tracking-tighter italic">Edit Profile</h2>
                </div>
                <Button 
                  onClick={handleSave} 
                  disabled={isSubmitting}
                  className="bg-white text-black hover:bg-primary hover:text-white rounded-full font-black px-6"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/40">Username</label>
                  <input 
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-all outline-none font-bold"
                    placeholder="Set your rebel alias"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-white/40">Nikita Crime Sheet (Bio)</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-primary transition-all outline-none resize-none"
                    placeholder="Tell the pit your story..."
                  />
                </div>

                <div className="flex gap-4">
                   <input 
                    type="file" 
                    hidden 
                    ref={avatarInputRef} 
                    accept="image/*" 
                    onChange={(e) => handleImageSelect(e, "image")} 
                   />
                   <input 
                    type="file" 
                    hidden 
                    ref={bannerInputRef} 
                    accept="image/*" 
                    onChange={(e) => handleImageSelect(e, "bannerImage")} 
                   />

                   <div 
                    onClick={() => avatarInputRef.current?.click()}
                    className="flex-1 h-24 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-all relative overflow-hidden group"
                   >
                      {formData.image ? (
                        <img src={formData.image} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera className="w-6 h-6 text-white/40" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Avatar</span>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Camera className="w-6 h-6 text-white" />
                      </div>
                   </div>

                   <div 
                    onClick={() => bannerInputRef.current?.click()}
                    className="flex-2 flex-[2] h-24 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-all relative overflow-hidden group"
                   >
                      {formData.bannerImage ? (
                        <img src={formData.bannerImage} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera className="w-6 h-6 text-white/40" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Banner</span>
                        </>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Camera className="w-6 h-6 text-white" />
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
