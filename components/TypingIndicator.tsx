"use client";

interface TypingUser {
  userId: string;
  userName: string;
  updatedAt: number;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (!typingUsers || typingUsers.length === 0) return null;

  const names = typingUsers.map((t) => t.userName);
  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
        ? `${names[0]} and ${names[1]} are typing`
        : `${names[0]} and ${names.length - 1} others are typing`;

  return (
    <div className="flex items-end gap-2 px-4 py-1">
      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[200px]">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground truncate">{label}</span>
        </div>
      </div>
    </div>
  );
}
