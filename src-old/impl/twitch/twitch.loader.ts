import type Logger from "logger";
import ModuleLoader from "module/module.loader.ts";
import type Module from "module/module.ts";
import ChatBadgesModule from "modules/twitch/chat-badges/chat-badges.module.ts";
import ChatListenerModule from "modules/twitch/chat-listener/chat-listener.module.ts";
import ChattersModule from "modules/twitch/chatters/chatters.module.tsx";
import ClipDownloadModule from "modules/twitch/clip-download/clip-download.module.tsx";
import PinStreamerModule from "modules/twitch/favourite-streamers/pin-streamer.module.tsx";
import StreamLatencyModule from "modules/twitch/stream-latency/stream-latency.module.tsx";
import type { Emitter } from "nanoevents";
import type { TwitchEvents } from "types/events/twitch/events.d.ts";
import type { TwitchLocalStorageMap } from "types/storage/twitch/local.storage";
import type Utils from "utils/utils.ts";
import type StorageRepository from "../../storage/storage-repository.ts";

export default class TwitchLoader extends ModuleLoader {
	get(
		logger: Logger,
		utils: Utils,
		emitter: Emitter<TwitchEvents>,
		storage: StorageRepository<TwitchLocalStorageMap>,
	): Module<TwitchEvents, TwitchLocalStorageMap>[] {
		return [
			new ChattersModule(logger, utils, emitter, storage),
			new ChatListenerModule(logger, utils, emitter, storage),
			new StreamLatencyModule(logger, utils, emitter, storage),
			new ChatBadgesModule(logger, utils, emitter, storage),
			new PinStreamerModule(logger, utils, emitter, storage),
			new ClipDownloadModule(logger, utils, emitter, storage),
		];
	}
}
