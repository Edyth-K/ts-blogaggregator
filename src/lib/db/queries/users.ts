import { db } from "..";
import { users } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function createUser(name: string) {
    const nameExists = await getUser(name);
    if (nameExists) {
        throw new Error(`User already exists: ${name}`);
    }
    // INSERT INTO <table> (<columns>) VALUES (<values>) RETURNING *;
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}

export async function getUser(name: string) {
    const [result] = await db.select().from(users).where(eq(users.name, name));
    if (!result) {
        return undefined;
    }
    return result;
}

export async function reset() {
    await db.execute(sql`TRUNCATE TABLE users`);
}