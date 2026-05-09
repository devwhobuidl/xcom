"use client";

import React, { useState } from "react";
import { Camera, Edit2, Share2, Shield, Calendar, MapPin, Link as LinkIcon, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileModal } from "./EditProfileModal";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string | null;
    walletAddress: string;
    image: string | null;
    bannerImage: string | null;
    bio: string | null;
    points: number;
    createdAt: Date;
    _count?: {
      followers: number;
      following: number;
    };
  };
  isOwnProfile?: boolean;
}

export const ProfileHeader = ({ user, isOwnProfile }: ProfileHeaderProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied! Show them who's boss. 💀");
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative border-b border-white/5">
      {/* Banner Section */}
      <div className="h-48 md:h-72 bg-gradient-to-br from-primary/30 via-zinc-900 to-black relative overflow-hidden group">
        {user.bannerImage ? (
          <img src={user.bannerImage} alt="Banner" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {isOwnProfile && (
          <button className="absolute bottom-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-black">
            <Camera className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="px-6 pb-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-24 mb-6">
          {/* Avatar */}
          <div className="relative group/avatar">
            <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 md:border-8 border-black rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden bg-zinc-900">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="bg-zinc-800 text-primary text-4xl font-black">
                {user.username?.[0]?.toUpperCase() || "R"}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-all rounded-[2.5rem] md:rounded-[3.5rem]">
                <Camera className="w-8 h-8 text-white" />
              </button>
            )}
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-2xl border-4 border-black shadow-xl">
              <Skull className="w-6 h-6" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={copyProfileLink}
              className="bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl p-6"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            
            {isOwnProfile ? (
              <Button 
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest px-8 py-6 rounded-2xl"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            ) : (
              <Button className="bg-primary text-white hover:bg-primary/90 font-black uppercase tracking-widest px-12 py-6 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                Roast Profile
              </Button>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-4 max-w-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white">
                {user.username || "Anonymous Rebel"}
              </h1>
              <div className="px-2 py-0.5 bg-primary/20 border border-primary/30 rounded-lg">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">REBEL L01</span>
              </div>
            </div>
            <p className="text-white/40 font-mono text-sm">
              {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
            </p>
          </div>

          <p className="text-white/60 text-lg leading-relaxed font-medium">
            {user.bio || "This rebel hasn't written their manifesto yet. Probably too busy roasting Nikita. 💀"}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-white/40 font-bold text-xs uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Joined {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> {user.points.toLocaleString()} Chaos Points
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="group cursor-pointer">
              <span className="text-white font-black text-lg mr-1">{user._count?.following || 0}</span>
              <span className="text-white/40 text-xs font-black uppercase tracking-widest group-hover:text-white transition-colors">Following</span>
            </div>
            <div className="group cursor-pointer">
              <span className="text-white font-black text-lg mr-1">{user._count?.followers || 0}</span>
              <span className="text-white/40 text-xs font-black uppercase tracking-widest group-hover:text-white transition-colors">Followers</span>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal 
        user={user} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
};
