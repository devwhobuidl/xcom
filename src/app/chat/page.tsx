import React from "react";
import ChatClient from "@/components/chat/ChatClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ChatClient />
    </div>
  );
}
