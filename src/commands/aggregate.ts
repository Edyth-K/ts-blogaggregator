import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds.js";
import { fetchFeed } from "src/lib/rss.js";
import { createPost } from "src/lib/db/queries/posts.js";

export async function handlerAgg(cmdName: string, ...args: string[]) {
   if (args.length !== 1) {
      throw new Error("agg takes exactly 1 argument: time_between_reqs")
   }
   const timeBetweenRequests = parseDuration(args[0]);
   console.log(`Collecting feeds every: ${args[0]}`);
   scrapeFeeds().catch(handleError);
   const interval = setInterval(() => {
      scrapeFeeds().catch(handleError);
   }, timeBetweenRequests);

   await new Promise<void>((resolve) => {
      process.on("SIGINT", () => {
         console.log("Shutting down feed aggregator...");
         clearInterval(interval);
         resolve();
      });
   });
}

async function scrapeFeeds() {
   const nextFeed = await getNextFeedToFetch();
   if (!nextFeed) {
      console.log("No feeds to fetch.");
      return;
   }
   await markFeedFetched(nextFeed.id);
   const feed = await fetchFeed(nextFeed.url);
   for (const item of feed.channel.item) {
      try {
         await createPost({
            title: item.title,
            url: item.link,
            description: item.description,
            publishedAt: item.pubDate ? new Date(item.pubDate) : null,
            feedId: nextFeed.id,
         });
         console.log(`Saved post: ${item.title}`);
      } catch (err) {
         // skip duplicate URLs silently
         if (err instanceof Error && err.message.includes("unique")) {
            continue;
         }
         throw err;
      }
   }
}

function parseDuration(durationStr: string): number {
   const regex = /^(\d+)(ms|s|m|h)$/;
   const match = durationStr.match(regex);
   if (!match) {
      throw new Error(`Invalid duration: ${durationStr}`);
   }
   const value = parseInt(match[1]);
   const unit = match[2];
   switch (unit) {
      case "ms": return value;
      case "s": return value * 1000;
      case "m":  return value * 1000 * 60;
      case "h":  return value * 1000 * 60 * 60; 
      default: throw new Error(`Unknown unit: ${unit}`);
   }
}

function handleError(err: unknown) {
  console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`);
}

