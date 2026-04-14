import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
        },
    });
    
    const data = await response.text();
    const parser = new XMLParser();
    const parsedData = parser.parse(data);

    if (!parsedData.rss?.channel) {
        throw new Error("Channel field doesn't exist.");
    }
    
    const channel = parsedData.rss.channel;

    if (!(channel.title && channel.link && channel.description)) {
        throw new Error ("Channel must have title, link, and description fields");
    }

    const items = []

    if (channel.item) {
        if (Array.isArray(channel.item)) {
            for (const item of channel.item) {
                if (
                    item.title && 
                    item.link && 
                    item.description && 
                    item.pubDate
                ) {
                    items.push({
                        title: item.title,
                        link: item.link,
                        description: item.description,
                        pubDate: item.pubDate
                    });
                }
            }
        } else {
            if (
                channel.item.title && 
                channel.item.link && 
                channel.item.description && 
                channel.item.pubDate
            ) {
                const item = channel.item;
                items.push({
                    title: item.title,
                    link: item.link,
                    description: item.description,
                    pubDate: item.pubDate
                });
            }
            
        }
    } 
    
    // result contains channel metadata and item list
    const result = {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: items
        }
    }

    return result;
}