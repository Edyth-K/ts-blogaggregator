import { setUser, readConfig } from "src/config.js"
import { createUser, getUser, reset, getUsers } from "src/lib/db/queries/users.js";


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

export async function handleReset(cmdName: string, ...args: string[]) {
   await reset();
   console.log("Database reset successfully.");
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
   const users = await getUsers();
   const config = readConfig();
   const currentUser = config.currentUserName;
   for (const user of users) {
      if (user === currentUser) {
         console.log(`* ${user} (current)`);
      } else {
         console.log(`* ${user}`);
      }
   }
}