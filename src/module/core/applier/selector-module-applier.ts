import ModuleApplier from "module/core/applier/module-applier.ts";
import type Module from "module/core/module.ts";
import type { SelectorModuleApplierConfig } from "types/module/module-applier.types.ts";

export default class SelectorModuleApplier extends ModuleApplier {
	protected readonly appliers: SelectorModuleApplierRunner[] = [];

	async apply(module: Module) {
		const selectorAppliers = module.config.appliers.filter(
			(applier) => applier.type === "selector",
		) as SelectorModuleApplierConfig[];
		this.appliers.push(
			...selectorAppliers.map((selectorApplier) => ({
				config: selectorApplier,
				lastCheckedAt: 0,
			})),
		);
		this.run();
		setInterval(async () => this.run(), 1000);
	}

	private run() {
		for (const applier of this.appliers) {
			if (this.isApplierOnCooldown(applier)) continue;
			applier.lastCheckedAt = Date.now();
			const { config } = applier;
			if (config.validateUrl && !config.validateUrl(window.location.href))
				continue;
			const elements = this.processElements(
				config.selectors.flatMap((selector) => [
					...document.querySelectorAll(selector),
				]),
				config,
			);
			if (elements.length < 1) continue;
			config.callback(elements, config.key);
		}
	}

	private processElements(
		elements: Element[],
		config: SelectorModuleApplierConfig,
	) {
		return elements
			.map((_element) => {
				let element: Element | null = _element;
				if (element && config.useParent) element = element.parentElement;
				if (!element) return;
				if (this.isElementAlreadyUsed(element, config.key) && config.once)
					return;
				this.markElementAsUsed(element, config.key);
				return element;
			})
			.filter((element): element is Element => element !== undefined);
	}

	private isApplierOnCooldown(applier: SelectorModuleApplierRunner) {
		const cooldown = applier.config.cooldown;
		if (cooldown === undefined) return false;
		return Date.now() - applier.lastCheckedAt < cooldown;
	}

	private markElementAsUsed(element: Element, id: string) {
		element.setAttribute("enhanced", "true");
		element.setAttribute("enhancedAt", `${Date.now()}`);
		const modules = new Set(
			element.getAttribute("enhanced-modules")?.split(";") ?? [],
		);
		modules.add(id);
		element.setAttribute("enhanced-modules", [...modules].join(";"));
	}

	private isElementAlreadyUsed(element: Element, id: string) {
		const modules = element.getAttribute("enhanced-modules")?.split(";") ?? [];
		return element.hasAttribute("enhanced") && modules.includes(id);
	}
}

type SelectorModuleApplierRunner = {
	config: SelectorModuleApplierConfig;
	lastCheckedAt: number;
};
