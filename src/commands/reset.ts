import { reset } from "src/lib/db/queries/users.js";

export async function handlerReset(cmdName: string, ...args: string[]) {
   await reset();
   console.log("Database reset successfully.");
}