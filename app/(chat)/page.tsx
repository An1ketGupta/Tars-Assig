"use client";

import { Sidebar } from "@/components/Sidebar";
import { MessageSquare } from "lucide-react";

export default function ChatHomePage() {
  return (
    <>
      {/* Mobile: show sidebar */}
      <div className="flex md:hidden h-full">
        <Sidebar />
      </div>

      {/* Desktop: show welcome */}
      <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-semibold mb-2">Welcome to Tars Chat</h2>
          <p className="text-sm">
            Select a conversation or search for a user to start chatting
          </p>
        </div>
      </div>
    </>
  );
}
