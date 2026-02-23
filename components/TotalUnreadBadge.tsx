"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";

export function TotalUnreadBadge() {
  const totalUnread = useQuery(api.lastRead.getTotalUnread);

  if (!totalUnread || totalUnread === 0) return null;

  return (
    <Badge
      variant="destructive"
      className="h-5 min-w-5 rounded-full px-1 text-xs font-bold"
    >
      {totalUnread > 99 ? "99+" : totalUnread}
    </Badge>
  );
}
