import ChatAttachmentsModule from "module/twitch/chat-attachments/chat-attachments-module.ts";
import type { EventEmitter } from "types/content/event/events.types.ts";
import type Logger from "../../../shared/logger/logger.ts";
import type StorageRepository from "../../../shared/storage/storage-repository.ts";
import type ApiRepository from "../../api/api-repository.ts";
import type UtilsRepository from "../../utils/utils-repository.ts";
import ModuleRegisterer from "../module-registerer.ts";
import ChatBadgesModule from "./chat-badges/chat-badges-module.tsx";
import ChatModule from "./chat/chat-module.ts";
import ChattersModule from "./chatters/chatters-module.tsx";
import ClipDownloadModule from "./clip-download/clip-download-module.tsx";
import PinStreamerModule from "./pin-streamer/pin-streamer-module.tsx";
import SoundboardModule from "./soundboard/soundboard-module.tsx";
import StreamLatencyModule from "./stream-latency/stream-latency-module.tsx";
import ChatHighlightUserModule from "module/twitch/chat-highlight-user/chat-highlight-user-module.tsx";

export default class TwitchModuleRegisterer extends ModuleRegisterer {
	getModules(
		logger: Logger,
		eventEmitter: EventEmitter,
		storageRepository: StorageRepository,
		utilsRepository: UtilsRepository,
		apiRepository: ApiRepository,
	) {
		return [
			new ChatModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new ChatBadgesModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new ChatHighlightUserModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new ChatAttachmentsModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new PinStreamerModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new SoundboardModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new ClipDownloadModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new ChattersModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new StreamLatencyModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
		];
	}
}
