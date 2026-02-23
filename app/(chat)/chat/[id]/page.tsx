"use client";

import { use } from "react";
import { ChatArea } from "@/components/ChatArea";
import { ChatHeader } from "@/components/ChatHeader";
import { ConversationTitle } from "@/components/ConversationTitle";
import { Sidebar } from "@/components/Sidebar";
import { Id } from "@/convex/_generated/dataModel";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id } = use(params);
  const conversationId = id as Id<"conversations">;

  return (
    <>
      <ConversationTitle conversationId={conversationId} />
      {/* Mobile: show back button in header above chat */}
      <div className="flex md:hidden flex-col h-full overflow-hidden">
        <ChatHeader conversationId={conversationId} showBack />
        <ChatArea conversationId={conversationId} />
      </div>

      {/* Desktop: sidebar + chat side by side (sidebar from layout) */}
      <div className="hidden md:flex flex-col h-full overflow-hidden">
        <ChatHeader conversationId={conversationId} />
        <ChatArea conversationId={conversationId} />
      </div>
    </>
  );
}
