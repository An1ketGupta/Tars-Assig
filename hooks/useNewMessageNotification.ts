"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface UseNewMessageNotificationProps {
  conversationId: Id<"conversations">;
}

export function useNewMessageNotification({
  conversationId,
}: UseNewMessageNotificationProps) {
  const messages = useQuery(api.messages.list, { conversationId });
  const { user } = useUser();
  const prevCountRef = useRef<number | null>(null);
  const isVisibleRef = useRef(!document.hidden);

  // Track page visibility
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!messages || !user) return;

    const count = messages.length;

    // Skip first load
    if (prevCountRef.current === null) {
      prevCountRef.current = count;
      return;
    }

    // New message arrived
    if (count > prevCountRef.current) {
      const newMessages = messages.slice(prevCountRef.current);
      const fromOthers = newMessages.filter((m) => m.senderId !== user.id);

      if (fromOthers.length > 0 && !isVisibleRef.current) {
        // Request notification permission and show notification
        if (Notification.permission === "default") {
          Notification.requestPermission();
        } else if (Notification.permission === "granted") {
          const msg = fromOthers[fromOthers.length - 1];
          new Notification("New message — Tars Chat", {
            body: msg.isDeleted
              ? "This message was deleted"
              : msg.content ?? "New message",
            icon: "/favicon.ico",
          });
        }
      }

      prevCountRef.current = count;
    }
  }, [messages?.length, user, messages]);
}
