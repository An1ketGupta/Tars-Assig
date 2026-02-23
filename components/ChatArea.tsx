"use client";

import { useQuery, useMutation } from "convex/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import type { Doc } from "@/convex/_generated/dataModel";
import { MessageBubble } from "@/components/MessageBubble";
import { MessageInput } from "@/components/MessageInput";
import { DateSeparator } from "@/components/DateSeparator";
import { TypingIndicator } from "@/components/TypingIndicator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

interface ChatAreaProps {
  conversationId: Id<"conversations">;
}

export function ChatArea({ conversationId }: ChatAreaProps) {
  const messages = useQuery(api.messages.list, { conversationId });
  const typingUsers = useQuery(api.typing.getTypingUsers, { conversationId });
  const markRead = useMutation(api.lastRead.markRead);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showNewMessages, setShowNewMessages] = useState(false);
  const isAtBottomRef = useRef(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
    setShowNewMessages(false);
  }, []);

  // Mark as read when conversation opens
  useEffect(() => {
    markRead({ conversationId });
  }, [conversationId, markRead]);

  // Handle new messages
  useEffect(() => {
    if (!messages) return;
    if (isAtBottomRef.current) {
      scrollToBottom("smooth");
      markRead({ conversationId });
    } else {
      setShowNewMessages(true);
    }
  }, [messages?.length, conversationId, markRead, scrollToBottom]);

  // Detect scroll position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const threshold = 100;
    isAtBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    if (isAtBottomRef.current) setShowNewMessages(false);
  };

  if (messages === undefined) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}
            >
              <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
              <Skeleton
                className={`h-12 rounded-2xl ${i % 2 === 0 ? "w-48 rounded-bl-sm" : "w-36 rounded-br-sm"}`}
              />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = groupByDate(messages);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
        onScroll={handleScroll}
        ref={scrollAreaRef}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No messages yet — say hello! 👋</p>
          </div>
        ) : (
          <>
            {groupedMessages.map(({ dateLabel, date, messages: dayMsgs }) => (
              <div key={dateLabel}>
                <DateSeparator date={date} />
                <div className="space-y-1">
                  {dayMsgs.map((msg) => (
                    <MessageBubble
                      key={msg._id}
                      messageId={msg._id}
                      senderId={msg.senderId}
                      content={msg.content}
                      timestamp={msg.timestamp}
                      isDeleted={msg.isDeleted}
                      reactions={msg.reactions}
                    />
                  ))}
                </div>
              </div>
            ))}
            {/* Typing indicator */}
            {typingUsers && typingUsers.length > 0 && (
              <TypingIndicator typingUsers={typingUsers} />
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* New messages button */}
      {showNewMessages && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <Button
            onClick={() => scrollToBottom()}
            size="sm"
            className="rounded-full shadow-lg gap-1"
          >
            <ChevronDown className="h-4 w-4" />
            New messages
          </Button>
        </div>
      )}

      <MessageInput conversationId={conversationId} />
    </div>
  );
}

function groupByDate(messages: Doc<"messages">[]) {
  const groups: { dateLabel: string; date: Date; messages: Doc<"messages">[] }[] = [];
  let currentDay = "";

  for (const msg of messages) {
    const d = new Date(msg.timestamp);
    const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (dayKey !== currentDay) {
      currentDay = dayKey;
      const label = d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      groups.push({ dateLabel: label, date: d, messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }

  return groups;
}
