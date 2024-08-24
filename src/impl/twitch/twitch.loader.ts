import type { TwitchEvents } from "events/twitch/events.ts";
import type Logger from "logger";
import ModuleLoader from "module/module.loader.ts";
import type Module from "module/module.ts";
import ChatBadgesModule from "modules/twitch/chat-badges/chat-badges.module.ts";
import ChatListenerModule from "modules/twitch/chat-listener/chat-listener.module.ts";
import ChattersModule from "modules/twitch/chatters/chatters.module.tsx";
import StreamLatencyModule from "modules/twitch/stream-latency/stream-latency.module.tsx";
import type { Emitter } from "nanoevents";
import type CommonUtils from "utils/common.utils.ts";

export default class TwitchLoader extends ModuleLoader {
	get(
		logger: Logger,
		utils: CommonUtils,
		emitter: Emitter<TwitchEvents>,
	): Module[] {
		return [
			new ChattersModule(logger, utils, emitter),
			new ChatListenerModule(logger, utils, emitter),
			new StreamLatencyModule(logger, utils, emitter),
			new ChatBadgesModule(logger, utils, emitter),
		];
	}
}
