"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";

export function UnreadBadge({ conversationId }: { conversationId: Id<"conversations"> }) {
  const count = useQuery(api.lastRead.getUnreadCount, { conversationId });

  if (!count || count === 0) return null;

  return (
    <Badge className="ml-1 h-5 min-w-5 px-1 flex items-center justify-center bg-primary text-primary-foreground text-xs">
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
