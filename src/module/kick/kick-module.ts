import type Logger from "../../logger/logger.ts";
import type KickUtil from "../../util/kick.util.ts";
import Module from "../module.ts";
import type { ModuleConfig } from "../types.ts";

export default class KickModule extends Module {
	constructor(
		readonly name: string,
		readonly config: ModuleConfig,
		readonly logger: Logger,
		readonly utils: KickUtil,
	) {
		super(`kick-${name}`, config, logger, utils);
	}
}
