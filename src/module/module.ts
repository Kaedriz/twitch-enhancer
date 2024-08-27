import type Logger from "logger";
import type { Emitter, EventsMap } from "nanoevents";
import type CommonUtils from "utils/common.utils.ts";
import type StorageRepository from "../storage/storage-repository.ts";
import type { ModuleConfig, ModuleEvent } from "./types.ts";

export default class Module<EmitterEvents extends EventsMap, StorageMap> {
	private readonly moduleConfig: ModuleConfig;

	constructor(
		protected readonly logger: Logger,
		protected readonly utils: CommonUtils,
		protected readonly emitter: Emitter<EmitterEvents>,
		protected readonly storage: StorageRepository<StorageMap>,
	) {
		this.moduleConfig = this.config();
	}

	getConfig() {
		return this.moduleConfig;
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

	// Wrapper for initialize(), so it will be below config()
	_initialize() {
		return this.initialize();
	}

	protected initialize() {}

	protected async run(event: ModuleEvent): Promise<void> {
		throw new Error("Missing run function");
	}

	protected config(): ModuleConfig {
		throw new Error("Missing module config");
	}
}
