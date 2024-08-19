import Logger from "logger";
import ModuleRepository from "module/module.repository.ts";
import ModuleRunner from "module/module.runner.ts";
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

	start() {
		if (this.started) {
			this.logger.warn("Extension is already started!");
			return;
		}
		this.started = true;
		this.logger.info(
			`Started ${this.mode} v${this.version} @ ${this.platform}`,
		);
		this.moduleRunner.initializeModules();
		this.moduleRunner.start();
	}
}
