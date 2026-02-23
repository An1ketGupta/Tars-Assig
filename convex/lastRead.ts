import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const markRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const existing = await ctx.db
      .query("lastRead")
      .withIndex("by_user_conversation", (q) =>
        q.eq("userId", identity.subject).eq("conversationId", args.conversationId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { lastReadTime: Date.now() });
    } else {
      await ctx.db.insert("lastRead", {
        conversationId: args.conversationId,
        userId: identity.subject,
        lastReadTime: Date.now(),
      });
    }
  },
});

export const getUnreadCount = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const lr = await ctx.db
      .query("lastRead")
      .withIndex("by_user_conversation", (q) =>
        q.eq("userId", identity.subject).eq("conversationId", args.conversationId)
      )
      .first();

    const lastReadTime = lr?.lastReadTime ?? 0;
    const unread = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) =>
        q.and(
          q.gt(q.field("timestamp"), lastReadTime),
          q.neq(q.field("senderId"), identity.subject)
        )
      )
      .collect();

    return unread.length;
  },
});

export const getTotalUnread = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    // Get all conversations the user is part of
    const allConversations = await ctx.db.query("conversations").collect();
    const userConversations = allConversations.filter((c) =>
      (c.participants as string[]).includes(identity.subject)
    );

    let total = 0;
    for (const conv of userConversations) {
      const lr = await ctx.db
        .query("lastRead")
        .withIndex("by_user_conversation", (q) =>
          q.eq("userId", identity.subject).eq("conversationId", conv._id)
        )
        .first();

      const lastReadTime = lr?.lastReadTime ?? 0;
      const unread = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) =>
          q.eq("conversationId", conv._id)
        )
        .filter((q) =>
          q.and(
            q.gt(q.field("timestamp"), lastReadTime),
            q.neq(q.field("senderId"), identity.subject)
          )
        )
        .collect();
      total += unread.length;
    }

    return total;
  },
});
