import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const msgId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: identity.subject,
      content: args.content,
      timestamp: Date.now(),
      isDeleted: false,
    });

    await ctx.db.patch(args.conversationId, {
      lastMessageId: msgId,
      lastMessageTime: Date.now(),
      lastMessageText: args.content,
    });

    return msgId;
  },
});

export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
  },
});

export const softDelete = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const msg = await ctx.db.get(args.messageId);
    if (!msg) throw new Error("Message not found");
    if (msg.senderId !== identity.subject)
      throw new Error("Cannot delete someone else's message");
    await ctx.db.patch(args.messageId, { isDeleted: true, content: "" });
  },
});

export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const msg = await ctx.db.get(args.messageId);
    if (!msg) throw new Error("Message not found");

    const reactions = { ...(msg.reactions ?? {}) };
    const users = reactions[args.emoji] ?? [];
    if (users.includes(identity.subject)) {
      reactions[args.emoji] = users.filter((u) => u !== identity.subject);
      if (reactions[args.emoji].length === 0) delete reactions[args.emoji];
    } else {
      reactions[args.emoji] = [...users, identity.subject];
    }
    await ctx.db.patch(args.messageId, { reactions });
  },
});
