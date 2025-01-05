import chalk from "chalk";
import chokidar from "chokidar";
import serveStatic from "serve-static-bun";
import type Bundler from "./bundler";
import SimpleLogger from "./simple-logger";
import type { BundlerConfig } from "./types.ts";

export default class Server {
	private readonly logger = new SimpleLogger("Server");

	constructor(
		private readonly config: BundlerConfig,
		private readonly bundler: Bundler,
	) {}

	async watch() {
		const watcher = chokidar.watch(this.config.build.sourcePath, {
			ignoreInitial: true,
		});
		watcher.on(
			"all",
			async (eventName, path) => await this.handleFileUpdate(eventName, path),
		);
	}

	async start() {
		await this.bundler.bundle("development");
		await this.watch();
		Bun.serve({
			fetch: serveStatic(this.config.build.distributionPath),
			port: this.config.server.port,
		});
		this.logger.log(
			"Server started. Listening at:",
			chalk.magentaBright(`http://localhost:${this.config.server.port}`),
		);
	}

	private async handleFileUpdate(eventName: FileUpdateEvent, path: string) {
		const now = Date.now();
		await this.bundler.build("development");
		const symbol = FILE_SYMBOLS[eventName];
		if (symbol)
			this.logger.logWithCustomPrefix(
				symbol,
				chalk.white(path),
				chalk.gray.bold(`${Date.now() - now}ms`),
			);
	}
}

type FileUpdateEvent = "add" | "addDir" | "change" | "unlink" | "unlinkDir";
const FILE_SYMBOLS: Partial<Record<FileUpdateEvent, string>> = {
	add: chalk.greenBright("+"),
	change: chalk.yellowBright("*"),
	unlink: chalk.redBright("-"),
};
