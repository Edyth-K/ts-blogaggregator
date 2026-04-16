import { User } from "src/lib/db/schema.js";
import { readConfig } from "src/config.js";
import { CommandHandler } from "./commands/commands.js";
import { getUser } from "./lib/db/queries/users";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    const config = readConfig();
    const user = await getUser(config.currentUserName);
    if (!user) {
        throw new Error("User not found, please login");
    }
    await handler(cmdName, user, ...args);
  };
}
