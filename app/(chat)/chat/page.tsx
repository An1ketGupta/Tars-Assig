"use client";

import { Sidebar } from "@/components/Sidebar";
import { MessageSquare } from "lucide-react";

export default function ChatHomePage() {
  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Mobile: show sidebar full screen */}
      <div className="flex md:hidden w-full h-full">
        <Sidebar />
      </div>

      {/* Desktop: show welcome message in main area */}
      <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">Welcome to Tars Chat</h2>
          <p className="text-sm">
            Select a conversation or search for a user to start chatting
          </p>
        </div>
      </div>
    </div>
  );
}
