import Logger from "logger";
import ModuleRepository from "module/module.repository.ts";
import ModuleRunner from "module/module.runner.ts";
import TwitchLoader from "modules/twitch/twitch.loader.ts";
import CommonUtils from "utils/common.utils.ts";
import type { ExtensionMode, Platform } from "./types.ts";

export default class Extension {
	private readonly moduleRepository;
	private readonly moduleRunner;
	private readonly logger: Logger;
	private readonly utils;

	private started = false;

	constructor(
		private readonly platform: Platform,
		readonly version: string,
		readonly mode: ExtensionMode,
	) {
		this.moduleRepository = new ModuleRepository();
		this.logger = new Logger(this.mode);
		this.utils = new CommonUtils();
		this.moduleRunner = new ModuleRunner(
			this.logger,
			this.moduleRepository,
			this.utils,
		);
	}

	initializeModules() {
		this.logger.info("Initializing modules...");
		const loader = new TwitchLoader();
		this.moduleRepository.addModule(
			...loader.get(this.logger, this.utils).map((module) => {
				module.initialize();
				return module;
			}),
		);
		this.logger.info(`Initialized ${this.moduleRepository.size()} modules!`);
	}

	start() {
		if (this.started) {
			this.logger.warn("Extension is already started!");
			return;
		}
		this.started = true;
		this.initializeModules();
		this.logger.info(
			`Started ${this.mode} v${this.version} @ ${this.platform}`,
		);
		this.moduleRunner.start();
	}
}
