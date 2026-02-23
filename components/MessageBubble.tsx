"use client";

import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];

interface MessageBubbleProps {
  messageId: Id<"messages">;
  senderId: string;
  content: string;
  timestamp: number;
  isDeleted: boolean;
  reactions?: Record<string, string[]>;
}

export function MessageBubble({
  messageId,
  senderId,
  content,
  timestamp,
  isDeleted,
  reactions,
}: MessageBubbleProps) {
  const { user } = useUser();
  const isMe = user?.id === senderId;
  const senderData = useQuery(api.users.getUserByClerkId, { clerkId: senderId });
  const softDelete = useMutation(api.messages.softDelete);
  const toggleReaction = useMutation(api.messages.toggleReaction);

  const handleDelete = async () => {
    await softDelete({ messageId });
  };

  const handleReaction = async (emoji: string) => {
    await toggleReaction({ messageId, emoji });
  };

  const hasReactions = reactions && Object.keys(reactions).length > 0;

  return (
    <div className={cn("flex items-end gap-2 group", isMe && "flex-row-reverse")}>
      {!isMe && (
        <Avatar className="h-7 w-7 flex-shrink-0">
          <AvatarImage src={senderData?.imageUrl} />
          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
            {senderData?.name?.charAt(0).toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col max-w-[70%]", isMe && "items-end")}>
        {!isMe && senderData && (
          <span className="text-xs text-muted-foreground mb-0.5 ml-1">
            {senderData.name}
          </span>
        )}

        <div className="relative">
          {/* Reaction picker on hover */}
          {!isDeleted && (
            <div
              className={cn(
                "absolute -top-8 flex gap-1 bg-popover border border-border rounded-full px-2 py-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10",
                isMe ? "right-0" : "left-0"
              )}
            >
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-sm hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
              {isMe && (
                <button
                  onClick={handleDelete}
                  className="ml-1 text-destructive hover:scale-125 transition-transform"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm",
              isMe
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm",
              isDeleted && "italic opacity-60"
            )}
          >
            {isDeleted ? "This message was deleted" : content}
          </div>
        </div>

        {/* Reactions */}
        {hasReactions && !isDeleted && (
          <div className={cn("flex flex-wrap gap-1 mt-1", isMe && "justify-end")}>
            {Object.entries(reactions!).map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className={cn(
                  "flex items-center gap-0.5 text-xs rounded-full px-2 py-0.5 border transition-colors",
                  users.includes(user?.id ?? "")
                    ? "bg-primary/20 border-primary/40"
                    : "bg-muted border-border hover:bg-accent"
                )}
              >
                {emoji} <span>{users.length}</span>
              </button>
            ))}
          </div>
        )}

        <span className="text-xs text-muted-foreground mt-0.5 mx-1">
          {formatTimestamp(timestamp)}
        </span>
      </div>
    </div>
  );
}
