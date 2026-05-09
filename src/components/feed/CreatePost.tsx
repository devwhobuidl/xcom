"use client";

import { useState } from "react";
import { createPost } from "@/app/actions/community";
import { Button } from "@/components/ui/button";
import { ImagePlus, Send, Skull } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function CreatePost() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Connect your wallet to join the rebellion!");
      return;
    }
    if (!content.trim()) return;

    try {
      setIsPending(true);
      await createPost(content);
      setContent("");
      toast.success("Post live! +50 pts 💀");
    } catch {
      toast.error("Failed to post. Nikita is winning.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="glass p-4 border-primary/20 bg-primary/5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening in the rebellion? (Fuck Nikita)"
          className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none min-h-[100px] placeholder:text-muted-foreground/50 font-mono"
        />
        
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" type="button">
              <ImagePlus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10" type="button">
              <Skull className="w-5 h-5" />
            </Button>
          </div>
          
          <Button 
            type="submit" 
            disabled={isPending || !content.trim()}
            className="bg-primary hover:bg-primary/80 text-white font-bold px-6 rounded-none transform skew-x-[-12deg]"
          >
            <span className="transform skew-x-[12deg] flex items-center gap-2">
              <Send className="w-4 h-4" />
              {isPending ? "POSTING..." : "ROAST"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
