"use client";

import { Sidebar } from "@/components/Sidebar";
import { MessageSquare, Users, Zap } from "lucide-react";

export default function ChatHomePage() {
  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Mobile: show sidebar full screen */}
      <div className="flex md:hidden w-full h-full">
        <Sidebar />
      </div>

      {/* Desktop: show welcome message in main area */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-background">
        <div className="text-center max-w-md px-8 space-y-6">
          <div className="relative inline-flex">
            <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
              <MessageSquare className="h-12 w-12 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome to Tars Chat</h2>
            <p className="text-muted-foreground leading-relaxed">
              Select a conversation from the sidebar or find a user to start a new chat.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 text-left">
              <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">Real-time</div>
                <div className="text-xs text-muted-foreground mt-0.5">Messages sync instantly across all devices</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 text-left">
              <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-foreground">Group Chats</div>
                <div className="text-xs text-muted-foreground mt-0.5">Create groups with multiple people at once</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
