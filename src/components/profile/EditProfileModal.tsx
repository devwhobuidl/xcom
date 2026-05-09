"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/app/actions/user";
import { toast } from "sonner";
import { Camera, X } from "lucide-react";

export const EditProfileModal = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      toast.success("Identity updated. Nikita won't recognize you.");
      setOpen(false);
    } catch (error) {
      toast.error("System failure. Try again rebel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full font-black uppercase tracking-widest border-white/20 hover:bg-white/5">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black border-white/10 text-white p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-4 flex flex-row items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
              <DialogTitle className="font-black italic uppercase tracking-tighter text-xl">Edit Profile</DialogTitle>
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-white text-black hover:bg-white/90 rounded-full font-black uppercase tracking-widest text-xs px-6"
            >
              Save
            </Button>
          </DialogHeader>

          <div className="space-y-6 pb-8">
            <div className="h-32 bg-zinc-900 relative group cursor-pointer overflow-hidden">
              {formData.bannerImage ? (
                <img src={formData.bannerImage} className="w-full h-full object-cover opacity-50" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5 opacity-50" />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white/50 group-hover:text-white transition-colors" />
              </div>
            </div>

            <div className="px-6 -mt-12 relative z-10">
              <div className="w-24 h-24 rounded-full border-4 border-black bg-zinc-800 relative group cursor-pointer overflow-hidden">
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover opacity-50" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-black italic text-2xl opacity-50">
                    {formData.username?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>

            <div className="px-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-black uppercase tracking-widest text-white/50">Username</Label>
                <Input 
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-black border-white/10 focus:border-primary text-white font-medium"
                  placeholder="The_Ungovernable"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs font-black uppercase tracking-widest text-white/50">Bio / Nikita Crimes</Label>
                <Textarea 
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="bg-black border-white/10 focus:border-primary text-white font-medium h-24 resize-none"
                  placeholder="I once sent Nikita a 0.0001 SOL tip with a link to my OnlyFans..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-xs font-black uppercase tracking-widest text-white/50">Avatar URL</Label>
                <Input 
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="bg-black border-white/10 focus:border-primary text-white font-mono text-xs"
                  placeholder="https://imgur.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bannerImage" className="text-xs font-black uppercase tracking-widest text-white/50">Banner URL</Label>
                <Input 
                  id="bannerImage"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, bannerImage: e.target.value }))}
                  className="bg-black border-white/10 focus:border-primary text-white font-mono text-xs"
                  placeholder="https://imgur.com/..."
                />
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
