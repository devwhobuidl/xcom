"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { joinCommunity, leaveCommunity } from "@/app/actions/community";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface JoinButtonProps {
  communityId: string;
  isJoined: boolean;
  memberCount?: number;
}

export function JoinButton({ communityId, isJoined: initialJoined }: JoinButtonProps) {
  const [isJoined, setIsJoined] = useState(initialJoined);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setLoading(true);
      if (isJoined) {
        await leaveCommunity(communityId);
        setIsJoined(false);
        toast.info("Left community");
      } else {
        await joinCommunity(communityId);
        setIsJoined(true);
        toast.success("Joined community");
      }
    } catch (error) {
      toast.error("Failed to update membership");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isJoined ? "outline" : "primary"}
      size="sm"
      disabled={loading}
      onClick={handleToggle}
      className="min-w-[80px]"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isJoined ? (
        "JOINED"
      ) : (
        "JOIN"
      )}
    </Button>
  );
}
