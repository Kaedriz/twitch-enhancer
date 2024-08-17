import type Module from "module/module.ts";
import type { ModuleType } from "module/types.ts";

export default class ModuleRepository {
	private modules: Module[] = [];

	addModule(...module: Module[]) {
		this.modules.push(...module);
	}

	getModules() {
		return this.modules;
	}

	size() {
		return this.modules.length;
	}

	getModuleByType(type: ModuleType) {
		return this.modules.filter((module) => module.getConfig().type === type);
	}
}
