import { readConfig } from "src/config.js"
import { getUser } from "src/lib/db/queries/users.js";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds.js";
import { Feed, User } from "src/lib/db/schema.js";
import { createFeedFollow } from "src/lib/db/queries/feed-follows";

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();
    if (!feeds) {
        throw new Error("invalid feeds");
    }
    for (const feed of feeds) {
        console.log(feed);
    }
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
   if (args.length !== 2) {
      throw new Error("invalid number of arguments");
   }
   const [name, url] = args;

   const config = readConfig();
   const user = await getUser(config.currentUserName);
   if (!user) {
      throw new Error("User not found, please login");
   }
   const userId = user.id;

   const feed = await createFeed(name, url, userId);
   if (!feed) {
      throw new Error("feed was invalid");
   }
   await createFeedFollow(userId, feed.id);
   printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
    console.log(`ID: ${feed.id}`);
    console.log(`createdAt: ${feed.createdAt}`);
    console.log(`updatedAt: ${feed.updatedAt}`);
    console.log(`Name: ${feed.name}`);
    console.log(`URL: ${feed.url}`);
    console.log(`User: ${user.name}`);
}
