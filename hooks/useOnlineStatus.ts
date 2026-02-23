"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export function useOnlineStatus() {
  const { user } = useUser();
  const setOnlineStatus = useMutation(api.users.setOnlineStatus);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  const setOnline = useCallback(() => {
    if (user) setOnlineStatus({ isOnline: true });
  }, [user, setOnlineStatus]);

  const setOffline = useCallback(() => {
    if (user) setOnlineStatus({ isOnline: false });
  }, [user, setOnlineStatus]);

  useEffect(() => {
    if (!user) return;

    setOnline();
    heartbeatRef.current = setInterval(setOnline, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") setOnline();
      else setOffline();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", setOffline);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", setOffline);
      setOffline();
    };
  }, [user, setOnline, setOffline]);
}
