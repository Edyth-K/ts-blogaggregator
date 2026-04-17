# Gator

A CLI blog aggregator built with TypeScript and PostgreSQL. Gator lets you follow RSS feeds and browse the latest posts from your terminal.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a config file at `~/.gatorconfig.json`:

```json
{
  "db_url": "postgres://user:password@localhost:5432/gator",
  "current_user_name": ""
}
```

3. Run database migrations:

```bash
npm run migrate
```

## Usage

All commands are run with:

```bash
npm run start <command> [args]
```

### User Commands

| Command | Args | Description |
|---|---|---|
| `register` | `<name>` | Register a new user and log in |
| `login` | `<name>` | Log in as an existing user |
| `users` | | List all users (current user marked with `*`) |
| `reset` | | Truncate all database tables |

### Feed Commands

| Command | Args | Description |
|---|---|---|
| `addfeed` | `<name> <url>` | Add a new RSS feed and follow it |
| `feeds` | | List all feeds |
| `follow` | `<url>` | Follow an existing feed |
| `unfollow` | `<url>` | Unfollow a feed |
| `following` | | List all feeds you are following |

### Aggregation & Browsing

| Command | Args | Description |
|---|---|---|
| `agg` | `<time_between_reqs>` | Start the feed aggregator loop (e.g. `1m`, `30s`) |
| `browse` | `[limit]` | Browse the latest posts from your followed feeds (default: 2) |

### Example Workflow

```bash
# Register and log in
npm run start register alice

# Add and follow some feeds
npm run start addfeed "Boot.dev Blog" "https://www.boot.dev/blog/index.xml"
npm run start addfeed "Hacker News" "https://hnrss.org/newest"

# Run the aggregator in one terminal (fetches posts every minute)
npm run start agg 1m

# Browse the latest posts in another terminal
npm run start browse 10
```

## Development

Generate and run migrations after schema changes:

```bash
npm run generate
npm run migrate
```
