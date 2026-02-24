"use client";

import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Users, Inbox } from "lucide-react";
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
      <div className="space-y-1 px-3 py-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
            <div className="h-11 w-11 rounded-full bg-muted/60" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-24 bg-muted/60 rounded-md" />
              <div className="h-3 w-36 bg-muted/40 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
        <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <Inbox className="h-7 w-7 opacity-40" />
        </div>
        <p className="font-semibold text-sm text-foreground/70">No conversations yet</p>
        <p className="text-xs mt-1.5 text-muted-foreground/80">Switch to People tab to start chatting</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="px-3 py-2 space-y-0.5">
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
      className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all duration-200 text-left group/item ${
        isActive
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-accent/60 border border-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-11 w-11 ring-2 ring-background">
          {displayImage && <AvatarImage src={displayImage} />}
          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-sm font-semibold">
            {isGroup ? <Users className="h-4.5 w-4.5" /> : displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-background animate-pulse-glow" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className={`font-semibold text-[13px] truncate ${isActive ? 'text-foreground' : 'text-foreground/90'}`}>
            {displayName}
            {isGroup && memberCount && (
              <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">
                {memberCount} members
              </span>
            )}
          </p>
          <div className="flex items-center gap-1.5 ml-2">
            {lastMessageTime && (
              <span className="text-[10px] text-muted-foreground whitespace-nowrap font-medium">
                {formatTimestamp(lastMessageTime)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground truncate leading-relaxed">
            {lastMessageText ?? "Start a conversation..."}
          </p>
          <UnreadBadge conversationId={convoId} />
        </div>
      </div>
    </button>
  );
}
