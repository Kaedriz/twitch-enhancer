import Logger from "logger";
import ModuleRepository from "module/module.repository.ts";
import type { ElementModuleEvent } from "module/types.ts";
import TwitchLoader from "modules/twitch/twitch.loader.ts";
import CommonUtils from "utils/common-utils.ts";
import type { ExtensionMode, Platform } from "./types.ts";

export default class Extension {
	private readonly moduleRepository = new ModuleRepository();
	private readonly logger: Logger;
	private readonly utils = new CommonUtils();

	private started = false;

	constructor(
		private readonly platform: Platform,
		readonly version: string,
		readonly mode: ExtensionMode,
	) {
		this.logger = new Logger(this.mode);
	}

	initializeModules() {
		this.logger.info("Initializing modules...");
		const loader = new TwitchLoader();
		this.moduleRepository.addModule(...loader.get(this.logger, this.utils));
		this.logger.info(`Loaded ${this.moduleRepository.size()} modules!`);
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

		const test = setInterval(() => {
			const modules = this.moduleRepository.getModules();
			//TODO Move it
			modules.forEach(async (module) => {
				const config = module.getConfig();
				if (config.type === "element") {
					const elements: Element[] = config.elements
						.map((moduleElement) => {
							let element = document.querySelector(moduleElement.selector);
							if (element && moduleElement.useParent)
								element = element.parentElement;
							if (!element) return;
							if (
								this.utils.isElementAlreadyUsed(element) &&
								moduleElement.once
							)
								return;
							this.utils.markElementAsUsed(element);
							return element;
						})
						.filter((element): element is Element => element !== undefined);
					if (elements.length < 1) return;
					const event: ElementModuleEvent = {
						elements,
						createdAt: Date.now(),
					};
					this.logger.info(`Running ${module.id()} module`);
					await module._run(event);
				}
			});
		}, 1000);
	}
}
