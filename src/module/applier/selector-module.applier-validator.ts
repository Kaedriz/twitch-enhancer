import ModuleApplierValidator from "module/applier/module.appliter-validator.ts";
import type {
	ModuleApplierResult,
	ModuleApplierResultSuccess,
	ModuleApplierType,
	SelectorModuleApplier,
} from "types/module/module.applier.ts";

export default class SelectorModuleApplierValidator extends ModuleApplierValidator<
	SelectorModuleApplier,
	Element[]
> {
	type: ModuleApplierType = "selector";

	applies(config: SelectorModuleApplier): ModuleApplierResult<Element[]> {
		if (config.validateUrl && !config.validateUrl(window.location.href))
			return { applies: false };
		const elements = config.selectors.flatMap((selector) => [
			...document.querySelectorAll(selector),
		]);
		if (elements.length < 0) return { applies: false };
		return { applies: true, data: elements };
	}

	apply(
		config: SelectorModuleApplier,
		result: ModuleApplierResultSuccess<Element[]>,
	) {
		config.callback(result.data, config.key);
	}
}
