import { readConfig } from "./config.js";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands.js";
import { handlerLogin } from "./commands/users.js";

function main() {
    
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);

    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error("not enough arguments provided");
        process.exit(1);
    }
    const cmdName = args[0];
    const cmdArgs = args.slice(1);
    runCommand(registry, cmdName, ...cmdArgs)

    console.log(readConfig());
}

main();
