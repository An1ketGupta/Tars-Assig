"use client";

import { useQuery, useMutation } from "convex/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MessageBubble } from "@/components/MessageBubble";
import { MessageInput } from "@/components/MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { formatDateSeparator } from "@/lib/utils";

interface ChatAreaProps {
  conversationId: Id<"conversations">;
}

export function ChatArea({ conversationId }: ChatAreaProps) {
  const messages = useQuery(api.messages.list, { conversationId });
  const typingUsers = useQuery(api.typing.getTypingUsers, { conversationId });
  const markRead = useMutation(api.lastRead.markRead);
  const { user } = useUser();
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
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-md px-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 animate-pulse ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
            >
              <div className="h-7 w-7 rounded-full bg-muted" />
              <div className={`h-10 rounded-2xl bg-muted ${i % 2 === 0 ? "w-48" : "w-36"}`} />
            </div>
          ))}
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
            {groupedMessages.map(({ dateLabel, messages: dayMsgs }) => (
              <div key={dateLabel}>
                <div className="flex items-center justify-center my-4">
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {dateLabel}
                  </span>
                </div>
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
              <div className="flex items-end gap-2">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {typingUsers.map((t) => t.userName).join(", ")}{" "}
                      {typingUsers.length === 1 ? "is" : "are"} typing
                    </span>
                    <div className="flex gap-0.5 ml-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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

function groupByDate(
  messages: Array<{ _id: Id<"messages">; timestamp: number; [key: string]: unknown }>
) {
  const groups: { dateLabel: string; messages: typeof messages }[] = [];
  let currentLabel = "";

  for (const msg of messages) {
    const label = formatDateSeparator(msg.timestamp);
    if (label !== currentLabel) {
      currentLabel = label;
      groups.push({ dateLabel: label, messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }

  return groups;
}
