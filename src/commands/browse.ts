import { getPostsForUser } from "src/lib/db/queries/posts.js";
import { User } from "src/lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {

    const limit = args.length > 0 ? parseInt(args[0]) : 2;
    const posts = await getPostsForUser(user.id, limit);
    for (const { post } of posts) {
        console.log(`Title: ${post.title}`);
        console.log(`URL: ${post.url}`);
        console.log(`Published: ${post.publishedAt}`);
        console.log("---");
    }
}
