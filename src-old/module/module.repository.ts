import type Module from "module/module.ts";

export default class ModuleRepository {
	private modules: Module<any, any>[] = [];

	addModule(...module: Module<any, any>[]) {
		this.modules.push(...module);
	}

	getModules() {
		return this.modules;
	}

	size() {
		return this.modules.length;
	}
}
