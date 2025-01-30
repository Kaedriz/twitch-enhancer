import Logger from "logger";
import ModuleRepository from "module/module.repository.ts";
import ModuleRunner from "module/module.runner.ts";
import { createNanoEvents } from "nanoevents";
import type { TwitchEvents } from "types/events/twitch/events.d.ts";
import type { ExtensionMode, Platform } from "types/extension.ts";
import CommonUtils from "utils/common.utils.ts";
import StorageRepository from "./storage/storage-repository.ts";

export default class Extension {
	private readonly moduleRepository;
	private readonly moduleRunner;
	private readonly storage = new StorageRepository<never>("enhancer");
	private readonly emitter = createNanoEvents<TwitchEvents>(); // TODO Create generic type and TwitchExtensions which extends Extension
	private readonly logger: Logger;
	private readonly utils;

	private started = false;

	constructor(
		private readonly platform: Platform,
		readonly version: string,
		readonly mode: ExtensionMode,
	) {
		this.moduleRepository = new ModuleRepository();
		this.logger = new Logger(this.mode === "development");
		this.utils = new CommonUtils();
		this.moduleRunner = new ModuleRunner(
			this.logger,
			this.moduleRepository,
			this.utils,
			this.emitter,
			this.storage,
		);
	}

	start() {
		if (this.started) {
			this.logger.warn("Extension is already started!");
			return;
		}
		this.started = true;
		this.logger.info(
			`Started ${this.mode} v${this.version} @ ${this.platform}`,
		);
		this.moduleRunner.start();
		this.emitter.emit("start");
	}
}
