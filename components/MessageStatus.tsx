"use client";

import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageStatusProps {
  isRead?: boolean;
  isMine?: boolean;
  className?: string;
}

export function MessageStatus({ isRead, isMine, className }: MessageStatusProps) {
  if (!isMine) return null;

  return (
    <span className={cn("inline-flex items-center text-muted-foreground", className)}>
      {isRead ? (
        <CheckCheck className="h-3 w-3 text-primary" aria-label="Read" />
      ) : (
        <Check className="h-3 w-3" aria-label="Sent" />
      )}
    </span>
  );
}
