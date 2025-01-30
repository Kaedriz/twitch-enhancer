import type { ModuleApplier } from "types/module/module.applier.ts";

export type ModuleConfig = {
	name: string;
	appliers: ModuleApplier[];
};
