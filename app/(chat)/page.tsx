"use client";

import { Sidebar } from "@/components/Sidebar";
import { MessageSquare, Sparkles } from "lucide-react";

export default function ChatHomePage() {
  return (
    <>
      {/* Mobile: show sidebar */}
      <div className="flex md:hidden h-full">
        <Sidebar />
      </div>

      {/* Desktop: show welcome */}
      <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center animate-fade-in">
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 glow-primary">
            <Sparkles className="h-9 w-9 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gradient">Welcome to Tars Chat</h2>
          <p className="text-sm text-muted-foreground/70 max-w-xs mx-auto">
            Select a conversation or search for a user to start chatting
          </p>
        </div>
      </div>
    </>
  );
}
