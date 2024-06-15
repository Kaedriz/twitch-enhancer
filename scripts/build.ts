import config from "../build.json";
import Bundler from "./bundler.ts";
import BundlerServer from "./server.ts";

const bundler = new Bundler(
	config.build.entrypoints,
	config.build.source,
	config.build.out,
);

if (Bun.argv.includes("--server")) {
	const server = new BundlerServer(config.server.port, bundler);
	await server.serve();
} else await bundler.bundle();
