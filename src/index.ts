import { setUser, readConfig } from "./config.js";

function main() {
    console.log("Hello, world!");
    setUser("Edyth");
    console.log(readConfig());
}

main();
