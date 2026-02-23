"use client";

import { Sidebar } from "@/components/Sidebar";
import { useStoreUser } from "@/hooks/useStoreUser";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useStoreUser();
  useOnlineStatus();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - hidden on mobile when a chat is open */}
      <div className="hidden md:flex w-80 flex-shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
