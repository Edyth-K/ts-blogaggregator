import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string;
}

export function setUser(userName: string): void {
    let cfg = readConfig();
    cfg.currentUserName = userName;
    writeConfig(cfg);
}

export function readConfig(): Config {
    const filePath = getConfigFilePath();
    const fileContents = fs.readFileSync(filePath, {encoding: "utf-8"});
    const rawConfig = JSON.parse(fileContents);
    return validateConfig(rawConfig);
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), "workspace", "bootdev", "ts-blog-aggregator", ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
    const configFilePath = getConfigFilePath();
    const rawConfig = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName,
    };
    fs.writeFileSync(configFilePath, JSON.stringify(rawConfig, null, 2), "utf-8");
}

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig.db_url !== "string") {
        throw new Error("Config is missing db_url");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name ?? "",
    };
}