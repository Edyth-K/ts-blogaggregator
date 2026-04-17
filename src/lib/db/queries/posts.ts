import { db } from "..";
import { Post, posts, feedFollows } from "../schema.js";
import { eq, desc } from "drizzle-orm";



export async function createPost(post: Post) {
    const [result] = await db.insert(posts).values(post).returning();
    return result;
}

export async function getPostsForUser(userId: string, limit: number = 2) {
    return await db
        .select({ post: posts })
        .from(posts)
        .innerJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
        .where(eq(feedFollows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(limit);
}
