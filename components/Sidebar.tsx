"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { MessageSquare, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ConversationList } from "@/components/ConversationList";
import { UserList } from "@/components/UserList";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";

type Tab = "chats" | "users";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  return (
    <div className="flex flex-col h-full w-full border-r border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-primary text-primary-foreground">
            <MessageSquare className="h-4 w-4" />
          </div>
          <h1 className="text-lg font-bold">Tars Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowGroupDialog(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New group</TooltipContent>
          </Tooltip>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm transition-colors ${
            activeTab === "chats"
              ? "border-b-2 border-primary text-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Chats
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm transition-colors ${
            activeTab === "users"
              ? "border-b-2 border-primary text-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Users
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
