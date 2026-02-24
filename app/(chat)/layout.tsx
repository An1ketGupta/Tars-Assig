"use client";

import { Sidebar } from "@/components/Sidebar";
import { AuthGuard } from "@/components/AuthGuard";
import { useStoreUser } from "@/hooks/useStoreUser";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

function ChatInner({ children }: { children: React.ReactNode }) {
  useStoreUser();
  useOnlineStatus();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - visible on desktop */}
      <div className="hidden md:flex w-80 flex-shrink-0 flex-col border-r border-border/50">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ChatInner>{children}</ChatInner>
    </AuthGuard>
  );
}
