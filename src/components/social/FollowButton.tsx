"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onToggle?: () => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export const FollowButton = ({ 
  userId, 
  isFollowing, 
  onToggle,
  className,
  variant = "default" 
}: FollowButtonProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to toggle follow");

      const data = await res.json();
      toast.success(data.isFollowing ? "Rebel followed! 💀" : "Rebel abandoned.");
      
      if (onToggle) onToggle();
      router.refresh();
    } catch (error) {
      toast.error("System error. Nikita wins this round.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : variant}
      size="sm"
      onClick={handleFollow}
      disabled={loading}
      className={`font-black uppercase tracking-widest text-[10px] rounded-xl transition-all h-9 ${
        isFollowing 
          ? "border-white/10 text-white/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50" 
          : "bg-white text-black hover:bg-zinc-200"
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-3 h-3 mr-1.5" /> Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-3 h-3 mr-1.5" /> Follow
        </>
      )}
    </Button>
  );
};
