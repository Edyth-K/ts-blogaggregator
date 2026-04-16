import { readConfig } from "src/config.js";
import { createFeedFollow, getFeedFollowsForUser } from "src/lib/db/queries/feed-follows.js";
import { getFeedByUrl } from "src/lib/db/queries/feeds.js";
import { getUser } from "src/lib/db/queries/users";


export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("follow command should only have 1 argument: url");
    }
    const url = args[0];
    const feed = await getFeedByUrl(url);
    const feedId = feed.id;

    const config = readConfig();
    const user = await getUser(config.currentUserName);
    const userId = user.id;

    const newFollow = await createFeedFollow(userId, feedId);
    console.log(`Feed Name: ${newFollow.feedName}`);
    console.log(`Current User: ${newFollow.userName}`);

}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    const userId = user.id;

    const feedFollows = await getFeedFollowsForUser(userId);
    console.log("Current Feed Follows: ")
    for (const feedFollow of feedFollows) {
        console.log(feedFollow.feedName);
    }
}