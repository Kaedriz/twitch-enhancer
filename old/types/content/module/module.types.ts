import type { ModuleApplierConfig } from "types/content/module/module-applier.types.ts";

export type ModuleConfig = {
	name: string;
	appliers: ModuleApplierConfig[];
};
