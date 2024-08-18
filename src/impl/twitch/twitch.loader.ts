import type Logger from "logger";
import ModuleLoader from "module/module.loader.ts";
import type Module from "module/module.ts";
import ChattersModule from "modules/twitch/chatters/chatters.module.tsx";
import type CommonUtils from "utils/common.utils.ts";

export default class TwitchLoader extends ModuleLoader {
	get(logger: Logger, utils: CommonUtils): Module[] {
		return [new ChattersModule(logger, utils)];
	}
}
