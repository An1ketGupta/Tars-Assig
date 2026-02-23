"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

interface ChatHeaderProps {
  conversationId: Id<"conversations">;
  showBack?: boolean;
}

export function ChatHeader({ conversationId, showBack }: ChatHeaderProps) {
  const conversation = useQuery(api.conversations.get, { id: conversationId });
  const { user } = useUser();
  const router = useRouter();

  const otherClerkId =
    conversation && !conversation.isGroup
      ? conversation.participants.find((p) => p !== user?.id) ?? ""
      : "";

  const otherUser = useQuery(
    api.users.getUserByClerkId,
    conversation && !conversation.isGroup && otherClerkId
      ? { clerkId: otherClerkId }
      : "skip"
  );

  if (!conversation) return null;

  const isGroup = conversation.isGroup;
  const displayName = isGroup
    ? (conversation.groupName ?? "Group Chat")
    : (otherUser?.name ?? "...");
  const displayImage = isGroup ? undefined : otherUser?.imageUrl;
  const isOnline = !isGroup && (otherUser?.isOnline ?? false);
  const memberCount = isGroup ? conversation.participants.length : undefined;

  return (
    <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
      {showBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <div className="relative flex-shrink-0">
        <Avatar className="h-10 w-10">
          {displayImage && <AvatarImage src={displayImage} />}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {isGroup ? (
              <Users className="h-5 w-5" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="font-semibold truncate">
          {displayName}
          {isGroup && memberCount && (
            <span className="ml-1 font-normal text-sm text-muted-foreground">
              · {memberCount} members
            </span>
          )}
        </h2>
        <p className="text-xs text-muted-foreground">
          {isGroup
            ? `Group · ${memberCount} members`
            : isOnline
            ? "Online"
            : "Offline"}
        </p>
      </div>
    </div>
  );
}
