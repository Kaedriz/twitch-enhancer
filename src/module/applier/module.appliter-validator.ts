import type {
	CommonModuleApplier,
	ModuleApplierResult,
	ModuleApplierResultSuccess,
	ModuleApplierType,
} from "types/module/module.applier.ts";

export default abstract class ModuleApplierValidator<
	T extends CommonModuleApplier,
	R,
> {
	abstract type: ModuleApplierType;

	abstract applies(config: T): ModuleApplierResult<R>;

	abstract apply(config: T, result: ModuleApplierResultSuccess<R>): void;
}
