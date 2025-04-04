import type { ModuleApplierConfig } from "types/module/module-applier.types.ts";

export type ModuleConfig = {
	name: string;
	appliers: ModuleApplierConfig[];
};
