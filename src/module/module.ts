import type Logger from "../logger/logger.ts";
import type CommonUtils from "../util/common-utils.ts";
import type { ModuleConfig } from "./types.ts";

export default class Module {
	constructor(
		readonly name: string,
		readonly config: ModuleConfig,
		readonly logger: Logger,
		readonly utils: CommonUtils,
	) {}

	async initialize() {}

	async canSilentRun(): Promise<boolean> {
		return false;
	}

	async silentRun() {
		throw new Error("Not implemented");
	}

	async canRun(): Promise<boolean> {
		return false;
	}

	async run() {
		throw new Error("Not implemented");
	}

	enable() {}

	disable() {}
}
