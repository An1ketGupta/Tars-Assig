"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateGroupDialog({ open, onClose }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const users = useQuery(api.users.listUsers);
  const createGroup = useMutation(api.conversations.createGroup);
  const router = useRouter();

  const toggleUser = (clerkId: string) => {
    setSelectedIds((prev) =>
      prev.includes(clerkId) ? prev.filter((id) => id !== clerkId) : [...prev, clerkId]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedIds.length < 1) return;
    setIsCreating(true);
    try {
      const convoId = await createGroup({
        memberIds: selectedIds,
        groupName: groupName.trim(),
      });
      router.push(`/chat/${convoId}`);
      onClose();
      setGroupName("");
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to create group:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Group name..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <div className="text-sm text-muted-foreground">
            Select members ({selectedIds.length} selected)
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {users?.map((user) => (
              <button
                key={user._id}
                onClick={() => toggleUser(user.clerkId)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-2 transition-colors",
                  selectedIds.includes(user.clerkId)
                    ? "bg-primary/10"
                    : "hover:bg-accent"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-sm text-left">{user.name}</span>
                {selectedIds.includes(user.clerkId) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedIds.length < 1 || isCreating}
          >
            {isCreating ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
