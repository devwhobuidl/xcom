import React from "react";
import { ChatClient } from "@/components/chat/ChatClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <main className="flex-1">
      <ChatClient />
    </main>
  );
}
