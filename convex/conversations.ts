import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreate = mutation({
  args: { otherUserId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const myClerkId = identity.subject;

    const all = await ctx.db.query("conversations").collect();
    const existing = all.find(
      (c) =>
        !c.isGroup &&
        c.participants.includes(myClerkId) &&
        c.participants.includes(args.otherUserId)
    );

    if (existing) return existing._id;

    return await ctx.db.insert("conversations", {
      participants: [myClerkId, args.otherUserId],
      isGroup: false,
      lastMessageTime: Date.now(),
    });
  },
});

export const createGroup = mutation({
  args: {
    memberIds: v.array(v.string()),
    groupName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const myClerkId = identity.subject;

    const participants = [myClerkId, ...args.memberIds];
    return await ctx.db.insert("conversations", {
      participants,
      isGroup: true,
      groupName: args.groupName,
      groupMembers: participants,
      lastMessageTime: Date.now(),
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const myClerkId = identity.subject;

    const all = await ctx.db.query("conversations").collect();
    const mine = all.filter((c) => c.participants.includes(myClerkId));

    mine.sort((a, b) => (b.lastMessageTime ?? 0) - (a.lastMessageTime ?? 0));
    return mine;
  },
});

export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
