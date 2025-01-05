import config from "../config.json";
import Bundler from "./bundler";
import Server from "./server";

const bundler = new Bundler(config);
if (Bun.argv.includes("--server")) {
    const server = new Server(config, bundler);
    await server.start();
} else await bundler.bundle();
