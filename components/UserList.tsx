"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Users } from "lucide-react";

export function UserList() {
  const [searchQuery, setSearchQuery] = useState("");
  const users = useQuery(api.users.searchUsers, { query: searchQuery });
  const getOrCreate = useMutation(api.conversations.getOrCreate);
  const router = useRouter();

  const handleUserClick = async (clerkId: string) => {
    const convoId = await getOrCreate({ otherUserId: clerkId });
    router.push(`/chat/${convoId}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {users === undefined ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Users className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">
              {searchQuery ? `No users found for "${searchQuery}"` : "No other users yet"}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => handleUserClick(user.clerkId)}
                className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors text-left"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
