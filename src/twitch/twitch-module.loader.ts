import type Logger from "logger";
import ModuleLoader from "module/module.loader.ts";
import type Module from "module/module.ts";
import ExampleModule from "twitch/module/example/example.module.ts";
import type Utils from "utils/utils.ts";

export default class TwitchModuleLoader extends ModuleLoader {
	getModules(logger: Logger, utils: Utils): Module[] {
		return [new ExampleModule(logger, utils)];
	}
}
