import { setUser } from "src/config.js"

export function handlerLogin(cmdName: string, ...args: string[]) {
     if (args.length === 0) {
        throw new Error("login requires a username")
     }
     let username = args[0];
     setUser(username);
     console.log(`Username set to ${username}`);
}