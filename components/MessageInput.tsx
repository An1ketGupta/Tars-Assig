"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, AlertCircle, RefreshCw } from "lucide-react";

const TYPING_DEBOUNCE_MS = 500;

interface MessageInputProps {
  conversationId: Id<"conversations">;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [failedContent, setFailedContent] = useState<string | null>(null);
  const sendMessage = useMutation(api.messages.send);
  const setTyping = useMutation(api.typing.setTyping);
  const clearTyping = useMutation(api.typing.clearTyping);
  const { user } = useUser();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTyping = useCallback(() => {
    if (!user) return;
    setTyping({
      conversationId,
      userName: user.fullName ?? user.username ?? "Someone",
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      clearTyping({ conversationId });
    }, 2000);
  }, [conversationId, user, setTyping, clearTyping]);

  const handleSend = async (messageContent?: string) => {
    const toSend = messageContent ?? content;
    if (!toSend.trim() || isSending) return;
    setIsSending(true);
    setSendError(null);
    try {
      await sendMessage({ conversationId, content: toSend.trim() });
      setContent("");
      setFailedContent(null);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      clearTyping({ conversationId });
      textareaRef.current?.focus();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send";
      setSendError(msg);
      setFailedContent(toSend.trim());
    } finally {
      setIsSending(false);
    }
  };

  const handleRetry = () => {
    if (failedContent) handleSend(failedContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="p-4 border-t border-border bg-background">
      {sendError && (
        <div className="flex items-center gap-2 mb-2 text-destructive text-xs bg-destructive/10 rounded-lg px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="flex-1">Failed to send: {sendError}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRetry}
            className="h-6 px-2 text-xs text-destructive hover:text-destructive"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setSendError(null);
            if (e.target.value) handleTyping();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          className="min-h-[44px] max-h-[160px] resize-none bg-muted border-0 focus-visible:ring-1 rounded-xl"
          rows={1}
        />
        <Button
          onClick={() => handleSend()}
          disabled={!content.trim() || isSending}
          size="icon"
          className="flex-shrink-0 h-11 w-11 rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
