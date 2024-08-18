import type Logger from "logger";
import type Module from "module/module.ts";
import type CommonUtils from "utils/common.utils.ts";

export default abstract class ModuleLoader {
	abstract get(logger: Logger, utils: CommonUtils): Module[];
}
