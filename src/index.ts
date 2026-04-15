import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerAgg } from "./commands/aggregate.js"
import { handlerAddFeed, handlerFeeds } from "./commands/feeds.js";
import { handlerReset } from "./commands/reset.js"
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users.js"
async function main() {
    
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", handlerAddFeed);
    registerCommand(registry, "feeds", handlerFeeds);

    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("not enough arguments provided");
        process.exit(1);
    }
    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    try {
        await runCommand(registry, cmdName, ...cmdArgs);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
            console.error(`Error running command ${cmdName}: ${err}`);
        }
        process.exit(1);
    }
    
    process.exit(0)
}

main();
