import { readConfig } from "./config.js";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerReset, handlerLogin, handlerRegister, handlerUsers, handlerAgg } from "./commands/handlers.js";

async function main() {
    
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);

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
