"use client";

import { Sidebar } from "@/components/Sidebar";
import { MessageSquare, Users, Zap, Shield, Sparkles } from "lucide-react";

export default function ChatHomePage() {
  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Mobile: show sidebar full screen */}
      <div className="flex md:hidden w-full h-full">
        <Sidebar />
      </div>

      {/* Desktop: show welcome message in main area */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-background">
        <div className="text-center max-w-lg px-8 space-y-8 animate-fade-in">
          <div className="relative inline-flex">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto glow-primary">
              <Sparkles className="h-11 w-11 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-400 border-2 border-background animate-pulse-glow" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gradient">Welcome to Tars Chat</h2>
            <p className="text-muted-foreground/70 leading-relaxed max-w-sm mx-auto">
              Select a conversation from the sidebar or find a user to start a new chat.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center gap-2.5 p-5 rounded-2xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-foreground">Real-time</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Instant sync</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2.5 p-5 rounded-2xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-foreground">Groups</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Team chats</div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2.5 p-5 rounded-2xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-foreground">Secure</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Auth built-in</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
