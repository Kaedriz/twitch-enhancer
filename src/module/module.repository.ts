import type Module from "module/module.ts";

export default class ModuleRepository {
	private modules: Module<never, never>[] = [];

	addModule(...module: Module<never, never>[]) {
		this.modules.push(...module);
	}

	getModules() {
		return this.modules;
	}

	size() {
		return this.modules.length;
	}
}
