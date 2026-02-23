"use client";

import { formatDateSeparator } from "@/lib/utils";

interface DateSeparatorProps {
  date: Date;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center gap-3 my-4 px-4">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground font-medium bg-background px-2 whitespace-nowrap">
        {formatDateSeparator(date.getTime())}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
