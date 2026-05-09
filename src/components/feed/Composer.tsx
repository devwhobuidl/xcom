"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ImagePlus, Send, Skull, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPost } from "@/app/actions/community";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ComposerProps {
  parentId?: string;
  placeholder?: string;
  onSuccess?: () => void;
  initialCommunityId?: string;
}

export function Composer({ parentId, placeholder, onSuccess, initialCommunityId }: ComposerProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createPost(content);
      setContent("");
      toast.success("Post live! +50 pts 💀");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to post. Nikita is winning.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <div className="p-4 bg-zinc-950/50 backdrop-blur-xl border-b border-white/5 relative group">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10 border border-white/10">
          <AvatarImage src={session.user?.image || ""} />
          <AvatarFallback>{session.user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <form onSubmit={handleSubmit} className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder || "What's happening in the rebellion? (Fuck Nikita)"}
            className="w-full bg-transparent border-none focus:ring-0 text-xl resize-none min-h-[100px] placeholder:text-white/20 font-medium tracking-tight"
          />

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 rounded-full w-9 h-9" type="button">
                <ImagePlus className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 rounded-full w-9 h-9" type="button">
                <Skull className="w-5 h-5" />
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="bg-primary hover:bg-primary/90 text-white font-black px-6 rounded-full transition-all active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:grayscale"
            >
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                {isSubmitting ? "POSTING..." : "ROAST"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Composer;
