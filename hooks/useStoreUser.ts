"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

export function useStoreUser() {
  const { user, isLoaded } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isLoaded || !user || !isAuthenticated) return;
    storeUser({
      name: user.fullName ?? user.username ?? "Unknown",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      imageUrl: user.imageUrl,
    });
  }, [isLoaded, user, isAuthenticated, storeUser]);
}
