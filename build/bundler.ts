import fs from "node:fs";
import { rimraf } from "rimraf";
import SimpleLogger from "./simple-logger";
import { BundlerConfig, BuildType } from './types'

export default class Bundler {
	private readonly logger = new SimpleLogger("Bundler");

	constructor(private readonly config: BundlerConfig) {}

	async bundle(type: BuildType = "production") {
		const now = Date.now();
		this.logger.log("Bundling extension");
		await this.clearDistributionDir();
		await this.build(type);
		this.copyPublicDir();
		this.logger.log(`Successfully built in ${Date.now() - now}ms`);
	}

	async build(type: BuildType) {
		const { build } = this.config;
		await Bun.build({
			entrypoints: build.entryPointsPath,
			outdir: build.distributionPath,
			sourcemap: type === "production" ? "none" : "inline",
			define: {
				__mode__: JSON.stringify(type),
				__version__: "1.0.0",
			},
		});
	}

	private copyPublicDir() {
		fs.cpSync(
			this.config.build.publicPath,
			this.config.build.distributionPath,
			{ recursive: true },
		);
	}

	private async clearDistributionDir() {
		await rimraf(this.config.build.distributionPath);
	}
}
