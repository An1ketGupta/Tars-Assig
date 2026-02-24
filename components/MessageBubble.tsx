"use client";

import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { MessageReactionsPicker, ReactionCounts } from "@/components/MessageReactions";
import { MessageStatus } from "@/components/MessageStatus";

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

  return (
    <div className={cn("flex items-end gap-2 group py-0.5 animate-fade-in", isMe && "flex-row-reverse")}>
      {!isMe && (
        <Avatar className="h-7 w-7 flex-shrink-0 ring-1 ring-border/50">
          <AvatarImage src={senderData?.imageUrl} />
          <AvatarFallback className="text-[10px] font-semibold bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
            {senderData?.name?.charAt(0).toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col max-w-[70%]", isMe && "items-end")}>
        {!isMe && senderData && (
          <span className="text-[10px] text-muted-foreground/70 mb-1 ml-1 font-medium">
            {senderData.name}
          </span>
        )}

        <div className="relative">
          {/* Reaction picker + delete on hover */}
          {!isDeleted && (
            <div
              className={cn(
                "absolute -top-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 z-10",
                isMe ? "right-0" : "left-0"
              )}
            >
              <MessageReactionsPicker onReact={handleReaction} />
              {isMe && (
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-popover/90 backdrop-blur-sm border border-border/50 shadow-lg text-destructive hover:bg-destructive hover:text-white transition-all duration-200"
                  aria-label="Delete message"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed",
              isMe
                ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md shadow-lg shadow-primary/10"
                : "bg-muted/70 text-foreground rounded-bl-md border border-border/30",
              isDeleted && "italic opacity-50"
            )}
          >
            {isDeleted ? "This message was deleted" : content}
          </div>
        </div>

        {/* Reactions */}
        {!isDeleted && (
          <ReactionCounts
            reactions={reactions}
            onReact={handleReaction}
            currentUserId={user?.id}
          />
        )}

        <span className="text-[10px] text-muted-foreground/60 mt-1 mx-1 flex items-center gap-1 font-medium">
          {formatTimestamp(timestamp)}
          <MessageStatus isMine={isMe} />
        </span>
      </div>
    </div>
  );
}
