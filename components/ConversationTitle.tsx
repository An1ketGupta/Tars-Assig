"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ConversationTitleProps {
  conversationId: Id<"conversations">;
}

export function ConversationTitle({ conversationId }: ConversationTitleProps) {
  const conversation = useQuery(api.conversations.get, { id: conversationId });
  const { user } = useUser();

  const otherUserId = conversation && !conversation.isGroup && user
    ? (conversation.participants as string[]).find((p) => p !== user.id) ?? null
    : null;

  const otherUser = useQuery(
    api.users.getUserByClerkId,
    otherUserId ? { clerkId: otherUserId } : "skip"
  );

  useEffect(() => {
    if (!conversation) return;

    let title = "Tars Chat";
    if (conversation.isGroup && conversation.groupName) {
      title = `${conversation.groupName} — Tars Chat`;
    } else if (otherUser) {
      title = `${otherUser.name} — Tars Chat`;
    }
    document.title = title;

    return () => {
      document.title = "Tars Chat";
    };
  }, [conversation, otherUser]);

  return null;
}
