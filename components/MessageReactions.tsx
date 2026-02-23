"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢"] as const;

interface MessageReactionsPickerProps {
  onReact: (emoji: string) => void;
}

export function MessageReactionsPicker({ onReact }: MessageReactionsPickerProps) {
  return (
    <div className="flex items-center gap-0.5 bg-popover border border-border rounded-full shadow-lg px-1.5 py-1">
      {REACTION_EMOJIS.map((emoji) => (
        <Tooltip key={emoji}>
          <TooltipTrigger asChild>
            <button
              onClick={() => onReact(emoji)}
              className="text-base hover:scale-125 transition-transform duration-100 rounded px-1 py-0.5 hover:bg-accent"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {emoji}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

interface ReactionCountsProps {
  reactions?: Record<string, string[]>;
  onReact: (emoji: string) => void;
  currentUserId?: string;
}

export function ReactionCounts({ reactions, onReact, currentUserId }: ReactionCountsProps) {
  if (!reactions) return null;

  const entries = Object.entries(reactions).filter(([, users]) => users.length > 0);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {entries.map(([emoji, users]) => {
        const hasReacted = currentUserId ? users.includes(currentUserId) : false;
        return (
          <Tooltip key={emoji}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onReact(emoji)}
                className={`inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border transition-colors ${
                  hasReacted
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : "bg-muted border-border hover:bg-accent"
                }`}
                aria-label={`${emoji} ${users.length}`}
              >
                <span>{emoji}</span>
                <span className="font-medium">{users.length}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              {users.length} {users.length === 1 ? "reaction" : "reactions"}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
