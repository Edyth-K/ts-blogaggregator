
import { fetchFeed } from "./lib/rss.js";

const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
console.log(JSON.stringify(feed, null, 2));
