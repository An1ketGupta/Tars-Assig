import { Id } from "@/convex/_generated/dataModel";

export type User = {
  _id: Id<"users">;
  clerkId: string;
  name: string;
  email: string;
  imageUrl?: string;
  isOnline: boolean;
  lastSeen: number;
};

export type Conversation = {
  _id: Id<"conversations">;
  participants: string[];
  lastMessageId?: Id<"messages">;
  lastMessageTime?: number;
  lastMessageText?: string;
  isGroup: boolean;
  groupName?: string;
  groupMembers?: string[];
};

export type Message = {
  _id: Id<"messages">;
  conversationId: Id<"conversations">;
  senderId: string;
  content: string;
  timestamp: number;
  isDeleted: boolean;
  reactions?: Record<string, string[]>;
};
