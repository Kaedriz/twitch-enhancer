import type Logger from "../../logger/logger.ts";
import TwitchUtil from "../../util/twitch.util.ts";
import ChattersModule from "./chatters/chatters.module.tsx";
import type TwitchModule from "./twitch-module.ts";

export default function getModules(logger: Logger): TwitchModule[] {
	const utils = new TwitchUtil();
	return [new ChattersModule(logger, utils)];
}
