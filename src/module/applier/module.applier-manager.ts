import type Logger from "logger";
import EventModuleApplierValidator from "module/applier/event-module.applier-validator.ts";
import SelectorModuleApplierValidator from "module/applier/selector-module.applier-validator.ts";
import type {
	ModuleApplier,
	RequiredModuleApplier,
} from "types/module/module.applier.ts";

export default class ModuleApplierManager {
	constructor(private readonly logger: Logger) {}

	private validators = [
		new SelectorModuleApplierValidator(),
		new EventModuleApplierValidator(),
	];

	validate(config: ModuleApplier) {
		for (const validator of this.validators.filter(
			(validator) => validator.type === config.type,
		)) {
			const result = validator.applies(config as RequiredModuleApplier);
			if (!result.applies) continue;
			validator.apply(config as RequiredModuleApplier, result);
		}
	}
}
