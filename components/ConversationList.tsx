"use client";

import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Users } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { UnreadBadge } from "@/components/UnreadBadge";

export function ConversationList() {
  const conversations = useQuery(api.conversations.list);
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const activeId = params?.id as string | undefined;

  if (conversations === undefined) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-28 bg-muted rounded" />
              <div className="h-3 w-40 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
        <MessageSquare className="h-10 w-10 mb-3 opacity-40" />
        <p className="font-medium text-sm">No conversations yet</p>
        <p className="text-xs mt-1">Search for a user to start chatting</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {conversations.map((convo) => (
          <ConversationItem
            key={convo._id}
            convoId={convo._id}
            participants={convo.participants}
            isGroup={convo.isGroup}
            groupName={convo.groupName}
            lastMessageText={convo.lastMessageText}
            lastMessageTime={convo.lastMessageTime}
            myClerkId={user?.id ?? ""}
            isActive={activeId === convo._id}
            onClick={() => router.push(`/chat/${convo._id}`)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

function ConversationItem({
  convoId,
  participants,
  isGroup,
  groupName,
  lastMessageText,
  lastMessageTime,
  myClerkId,
  isActive,
  onClick,
}: {
  convoId: Id<"conversations">;
  participants: string[];
  isGroup: boolean;
  groupName?: string;
  lastMessageText?: string;
  lastMessageTime?: number;
  myClerkId: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const otherClerkId = participants.find((p) => p !== myClerkId) ?? "";
  const otherUser = useQuery(
    api.users.getUserByClerkId,
    isGroup ? "skip" : { clerkId: otherClerkId }
  );

  const displayName = isGroup
    ? (groupName ?? "Group Chat")
    : (otherUser?.name ?? "...");
  const displayImage = isGroup ? undefined : otherUser?.imageUrl;
  const isOnline = !isGroup && (otherUser?.isOnline ?? false);
  const memberCount = isGroup ? participants.length : undefined;

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg p-3 transition-colors text-left ${
        isActive ? "bg-accent" : "hover:bg-accent/50"
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-12 w-12">
          {displayImage && <AvatarImage src={displayImage} />}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {isGroup ? <Users className="h-5 w-5" /> : displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm truncate">
            {displayName}
            {isGroup && memberCount && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({memberCount})
              </span>
            )}
          </p>
          <div className="flex items-center gap-1">
            {lastMessageTime && (
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTimestamp(lastMessageTime)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground truncate">
            {lastMessageText ?? "No messages yet"}
          </p>
          <UnreadBadge conversationId={convoId} />
        </div>
      </div>
    </button>
  );
}
