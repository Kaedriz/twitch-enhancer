import ChannelSectionModule from "module/twitch/channel-section/channel-section-module.tsx";
import ChatAttachmentsModule from "module/twitch/chat-attachments/chat-attachments-module.ts";
import ChatCopyEmoteModule from "module/twitch/chat-copy-emote/chat-copy-emote-module.tsx";
import ChatHighlightUserModule from "module/twitch/chat-highlight-user/chat-highlight-user-module.tsx";
import ChatMessagePopupModule from "module/twitch/chat-message-popup/chat-message-popup.tsx";
import RealVideoTimeModule from "module/twitch/real-video-time/real-video-time-module.tsx";
import WatchTimeModule from "module/twitch/watchtime/watchtime-module.tsx";
import type { EventEmitter } from "types/content/event/events.types.ts";
import type Logger from "../../../shared/logger/logger.ts";
import type StorageRepository from "../../../../../src/shared/storage/storage-repository.ts";
import type ApiRepository from "../../api/api-repository.ts";
import type UtilsRepository from "../../utils/utils-repository.ts";
import ModuleRegisterer from "../module-registerer.ts";
import ChatBadgesModule from "./chat-badges/chat-badges-module.tsx";
import ChatModule from "./chat/chat-module.ts";
import ChattersModule from "./chatters/chatters-module.tsx";
import ClipDownloadModule from "./clip-download/clip-download-module.tsx";
import PinStreamerModule from "./pin-streamer/pin-streamer-module.tsx";
import StreamLatencyModule from "./stream-latency/stream-latency-module.tsx";

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
			new ClipDownloadModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new ChattersModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new StreamLatencyModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new ChatCopyEmoteModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new ChannelSectionModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new RealVideoTimeModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new ChatMessagePopupModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
			new WatchTimeModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository),
		];
	}
}
