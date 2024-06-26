import type Logger from "../logger/logger.ts";
import type CommonUtils from "../util/common-utils.ts";
import type { ModuleConfig } from "./types.ts";

export default class Module {
	private readonly id: string;

	constructor(
		readonly name: string,
		readonly config: ModuleConfig,
		readonly logger: Logger,
		readonly utils: CommonUtils,
	) {
		this.id = [this.config.platform, this.name].join("-");
	}

	// biome-ignore lint/suspicious/noExplicitAny: idk
	async canRun(data: any): Promise<boolean> {
		return false;
	}

	// biome-ignore lint/suspicious/noExplicitAny: idk
	async run(data: any) {}

	getId() {
		return this.id;
	}

	async enable() {}

	async disable() {}

	getElementId() {
		return `#${this.getRawElementId()}`;
	}

	getRawElementId() {
		return `enhancer-${this.name}`;
	}
}
