import type Logger from "logger";
import type ModuleRepository from "module/module.repository.ts";
import TwitchLoader from "modules/twitch/twitch.loader.ts";
import type { Emitter } from "nanoevents";
import type { TwitchEvents } from "types/events/twitch/events.d.ts";
import type { ModuleElement, ModuleEvent } from "types/module/module.d.ts";
import type Utils from "utils/utils.ts";
import type StorageRepository from "../storage/storage-repository.ts";

export default class ModuleRunner {
	private elementsTimer: Timer | undefined;

	constructor(
		private readonly logger: Logger,
		private readonly moduleRepository: ModuleRepository,
		private readonly utils: Utils,
		private readonly emitter: Emitter<TwitchEvents>,
		private readonly storage: StorageRepository<never>,
	) {}

	start() {
		this.initializeModules();
		this.initialize();
		this.logger.info("Module runner started");
	}

	private initializeModules() {
		this.logger.info("Initializing modules...");
		const loader = new TwitchLoader();
		this.moduleRepository.addModule(
			...loader
				.get(this.logger, this.utils, this.emitter, this.storage)
				.map((module) => {
					module.setup();
					this.logger.debug(`Initialized ${module.id()} module`);
					return module;
				}),
		);
		this.logger.info(`Initialized ${this.moduleRepository.size()} modules`);
	}

	private initialize() {
		this.run();
		if (this.elementsTimer) {
			this.logger.warn("Timer is already running");
			return;
		}
		this.elementsTimer = setInterval(() => this.run(), 1000);
	}

	private run() {
		this.moduleRepository.getModules().forEach(async (module) => {
			try {
				const config = module.getConfig();
				const elements: Element[] =
					config.elements
						?.flatMap((moduleElement) =>
							this.checkElement(moduleElement, module.id()),
						)
						.filter((element): element is Element => element !== undefined) ??
					[];
				if (elements.length < 1) return;
				const event: ModuleEvent = {
					elements,
					createdAt: Date.now(),
				};
				this.logger.info(`Running ${module.id()} module`);
				await module._run(event);
			} catch (error) {
				this.logger.error(
					`Error when running ${module.id()} module, error:`,
					error,
				);
			}
		});
	}

	private checkElement(moduleElement: ModuleElement, id: string) {
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

		const elements = [...document.querySelectorAll(moduleElement.selector)];
		return elements.map((_element) => {
			let element: Element | null = _element;
			if (element && moduleElement.useParent) element = element.parentElement;
			if (!element) return;

			if (
				this.utils.commonUtils.isElementAlreadyUsed(element, id) &&
				moduleElement.once
			)
				return;
			this.utils.commonUtils.markElementAsUsed(element, id);
			return element;
		});
	}
}
