import type Module from "module/module.ts";

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
}
