export const dynamic = 'force-dynamic';

import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Skull } from "lucide-react";
import { ChatClient } from "@/components/chat/ChatClient";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden">
      <ChatClient />
    </div>
  );
}
