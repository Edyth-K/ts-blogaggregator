import { eq, and } from "drizzle-orm";
import { db } from "..";
import { feeds, users, feedFollows } from "../schema";
import { getFeedByUrl } from "./feeds";

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({ userId, feedId }).returning();
    const [result] = await db
    .select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        feedName: feeds.name,
        userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

    return result;
}

export async function deleteFeedFollow(userId: string, feedUrl: string) {
    const feed = await getFeedByUrl(feedUrl);
    if (!feed) {
        throw new Error(`Feed not found: ${feedUrl}`);
    }
    const feedId = feed.id;
    const [result] = await db.delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
    .returning();
    return result;
}

export async function getFeedFollowsForUser(userId: string) {
    return await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            feedName: feeds.name,
            userName: users.name,
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.userId, userId));
}