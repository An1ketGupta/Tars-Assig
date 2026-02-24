"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { MessageSquare, Users, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConversationList } from "@/components/ConversationList";
import { UserList } from "@/components/UserList";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { TotalUnreadBadge } from "@/components/TotalUnreadBadge";

type Tab = "chats" | "users";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  return (
    <div className="flex flex-col h-full w-full bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-primary-foreground glow-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Tars Chat</h1>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">Messaging</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-accent"
                onClick={() => setShowGroupDialog(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">New group</TooltipContent>
          </Tooltip>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mx-4 mb-3 p-1 rounded-xl bg-muted/50">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
            activeTab === "chats"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Chats
          <TotalUnreadBadge />
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
            activeTab === "users"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          People
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chats" ? <ConversationList /> : <UserList />}
      </div>

      <CreateGroupDialog
        open={showGroupDialog}
        onClose={() => setShowGroupDialog(false)}
      />
    </div>
  );
}
