import { setUser } from "src/config.js"
import { createUser, getUser } from "src/lib/db/queries/users.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
   if (args.length === 0) {
      throw new Error("login requires a username")
   }
   const username = args[0];
   const user = await getUser(username);
   if (!user) {
      throw new Error(`User not found: ${username}`);
   }
   setUser(username);
   console.log(`Username set to ${username}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
   if (args.length === 0) {
      throw new Error("register requires a name")
   }
   const name = args[0];
   const user = await createUser(name);
   setUser(name);
   console.log("User registered succesfully.");
   console.log(user);
}