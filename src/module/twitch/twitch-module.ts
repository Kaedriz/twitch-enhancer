import type Logger from "../../logger/logger.ts";
import type TwitchUtil from "../../util/twitch.util.ts";
import Module from "../module.ts";
import type { ModuleConfig } from "../types.ts";

export default class TwitchModule extends Module {
	constructor(
		name: string,
		config: ModuleConfig,
		logger: Logger,
		readonly utils: TwitchUtil,
	) {
		super(`twitch-${name}`, config, logger, utils);
	}
}
