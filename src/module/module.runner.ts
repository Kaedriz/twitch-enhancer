import type Logger from "logger";
import type ModuleRepository from "module/module.repository.ts";
import type { ElementModuleEvent, ModuleElement } from "module/types.ts";
import TwitchLoader from "modules/twitch/twitch.loader.ts";
import type CommonUtils from "utils/common.utils.ts";

export default class ModuleRunner {
	private elementsTimer: Timer | undefined;

	constructor(
		private readonly logger: Logger,
		private readonly moduleRepository: ModuleRepository,
		private readonly utils: CommonUtils,
	) {}

	start() {
		this.initializeElements();
		this.logger.info("Module runner started");
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

	private initializeEvents() {}

	private runEvents() {}

	private initializeElements() {
		this.runElements();
		if (this.elementsTimer) {
			this.logger.warn("Elements timer is already running");
			return;
		}
		this.elementsTimer = setInterval(() => this.runElements(), 1000);
	}

	private runElements() {
		const modules = this.moduleRepository.getModuleByType("element");
		modules.forEach(async (module) => {
			try {
				const config = module.getConfig();
				if (config.type === "element") {
					const elements: Element[] = config.elements
						.map((moduleElement) => this.checkElement(moduleElement))
						.filter((element): element is Element => element !== undefined);
					if (elements.length < 1) return;
					const event: ElementModuleEvent = {
						elements,
						createdAt: Date.now(),
					};
					this.logger.info(`Running ${module.id()} module`);
					await module._run(event);
				}
			} catch (error) {
				this.logger.error(
					`Error when running ${module.name()} module, error:`,
					error,
				);
			}
		});
	}

	private checkElement(moduleElement: ModuleElement) {
		let element = document.querySelector(moduleElement.selector);
		if (element && moduleElement.useParent) element = element.parentElement;
		if (!element) return;

		if (moduleElement.urlConfig !== undefined) {
			const url = window.location.href;
			const { type, check, regex } = moduleElement.urlConfig;
			const contains = (check?.(url) ?? false) || (regex?.test(url) ?? false);
			if (
				(contains && type === "exclude") ||
				(!contains && type === "include")
			) {
				return;
			}
		}

		if (this.utils.isElementAlreadyUsed(element) && moduleElement.once) return;
		this.utils.markElementAsUsed(element);

		return element;
	}
}
