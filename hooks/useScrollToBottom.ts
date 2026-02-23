import { useRef, useCallback, useState } from "react";

export function useScrollToBottom() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
    setShowScrollButton(false);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const threshold = 100;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    isAtBottomRef.current = atBottom;
    if (atBottom) {
      setShowScrollButton(false);
    }
  }, []);

  const handleNewContent = useCallback(
    (autoScroll: boolean = true) => {
      if (isAtBottomRef.current && autoScroll) {
        scrollToBottom("smooth");
      } else {
        setShowScrollButton(true);
      }
    },
    [scrollToBottom]
  );

  return {
    bottomRef,
    containerRef,
    isAtBottomRef,
    showScrollButton,
    scrollToBottom,
    handleScroll,
    handleNewContent,
  };
}
