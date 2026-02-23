import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    isOnline: v.boolean(),
    lastSeen: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .searchIndex("search_name", { searchField: "name" }),

  conversations: defineTable({
    participants: v.array(v.string()),
    lastMessageId: v.optional(v.id("messages")),
    lastMessageTime: v.optional(v.number()),
    lastMessageText: v.optional(v.string()),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    groupMembers: v.optional(v.array(v.string())),
  }).index("by_participant", ["participants"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    content: v.string(),
    timestamp: v.number(),
    isDeleted: v.boolean(),
    reactions: v.optional(v.record(v.string(), v.array(v.string()))),
  }).index("by_conversation", ["conversationId", "timestamp"]),

  typingStatus: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
    userName: v.string(),
    updatedAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  lastRead: defineTable({
    conversationId: v.id("conversations"),
    userId: v.string(),
    lastReadTime: v.number(),
  }).index("by_user_conversation", ["userId", "conversationId"]),
});
