"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Phone, Video, MoreVertical } from "lucide-react";

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
    ? conversation.participants.find((p: string) => p !== user?.id) ?? ""
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
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {showBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/chat")}
          className="flex-shrink-0 h-9 w-9 rounded-xl"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Button>
      )}

      <div className="relative flex-shrink-0">
        <Avatar className="h-10 w-10 ring-2 ring-background">
          {displayImage && <AvatarImage src={displayImage} />}
          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold">
            {isGroup ? (
              <Users className="h-4.5 w-4.5" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background animate-pulse-glow" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-sm truncate">{displayName}</h2>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          {isGroup ? (
            <>{memberCount} member{memberCount === 1 ? "" : "s"}</>
          ) : isOnline ? (
            <><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" /> Active now</>
          ) : (
            "Offline"
          )}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
