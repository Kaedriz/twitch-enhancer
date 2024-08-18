import type Logger from "logger";
import type CommonUtils from "utils/common.utils.ts";
import type { ModuleConfig, ModuleEvent } from "./types.ts";

export default class Module {
	private readonly moduleConfig: ModuleConfig;

	constructor(
		protected readonly logger: Logger,
		protected readonly utils: CommonUtils,
	) {
		this.moduleConfig = this.config();
	}

	initialize() {}

	getConfig() {
		return this.moduleConfig;
	}

	name() {
		return this.moduleConfig.name;
	}

	/**
	 * Returns id of module with combined enhancer word
	 * @example
	 * enhancer-chatters
	 */
	id() {
		return `enhancer-${this.moduleConfig.name}`;
	}

	/**
	 * Returns selector of module, based on id() function
	 * @example
	 * #enhancer-chatters / .enhancer-chatters
	 *
	 * @param [type="id"] Use id or class for returning selector
	 */
	selector(type: "id" | "class" = "id") {
		const prefix = type === "id" ? "#" : ".";
		return `${prefix}${this.id()}`;
	}

	// Wrapper for run(), so it will be below config()
	async _run(event: ModuleEvent) {
		return this.run(event);
	}

	protected async run(event: ModuleEvent): Promise<void> {
		throw new Error("Missing run function");
	}

	protected config(): ModuleConfig {
		throw new Error("Missing module config");
	}
}
