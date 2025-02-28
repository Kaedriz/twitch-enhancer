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
				called: false, // TODO Maybe we will need to rollback to old system with element id/classes
			})),
		);
		this.run();
		setInterval(async () => this.run(), 1000);
	}

	private run() {
		for (const applier of this.appliers) {
			if (this.isApplierOnCooldown(applier)) continue;
			if (this.isApplierAlreadyCalled(applier)) continue;
			const { config } = applier;
			if (config.validateUrl && !config.validateUrl(window.location.href))
				continue;
			const elements = config.selectors.flatMap((selector) => [
				...document.querySelectorAll(selector),
			]);
			if (elements.length < 1) continue;
			config.callback(elements, config.key);
			applier.called = true;
		}
	}

	private isApplierOnCooldown(applier: SelectorModuleApplierRunner) {
		const cooldown = applier.config.cooldown;
		if (cooldown === undefined) return false;
		const now = Date.now();
		const result = now - applier.lastCheckedAt < cooldown;
		applier.lastCheckedAt = now;
		return result;
	}

	private isApplierAlreadyCalled(applier: SelectorModuleApplierRunner) {
		return applier.config.once && applier.called;
	}
}

type SelectorModuleApplierRunner = {
	config: SelectorModuleApplierConfig;
	lastCheckedAt: number;
	called: boolean;
};
