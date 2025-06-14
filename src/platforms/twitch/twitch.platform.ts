import Platform from "$shared/platform/platform.ts";
import TwitchApi from "$twitch/apis/twitch.api.ts";
import ChatAttachmentsModule from "$twitch/modules/chat-attachments/chat-attachments-module.ts";
import ChatBadgesModule from "$twitch/modules/chat-badges/chat-badges-module.tsx";
import ChattersModule from "$twitch/modules/chatters/chatters.module.tsx";
import PinStreamerModule from "$twitch/modules/pin-streamer/pin-streamer.module.tsx";
import RealVideoTimeModule from "$twitch/modules/real-video-time/real-video-time-module.tsx";
import SettingsButtonModule from "$twitch/modules/settings-button/settings-button.module.tsx";
import WatchTimeModule from "$twitch/modules/watchtime/watchtime.module.tsx";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import type { TwitchStorage } from "$types/platforms/twitch/twitch.storage.types.ts";
import ChannelSectionModule from "./modules/channel-section/channel-section-module.tsx";
import ChatCopyEmoteModule from "./modules/chat-copy-emote/chat-copy-emote-module.tsx";
import ChatHighlightUserModule from "./modules/chat-highlight-user/chat-highlight-user-module.tsx";
import ChatMessagePopupModule from "./modules/chat-message-popup/chat-message-popup.tsx";
import ChatModule from "./modules/chat/chat-module.tsx";
import ClipDownloadModule from "./modules/clip-download/clip-download-module.tsx";
import ExampleModule from "./modules/example/example.module.ts";
import StreamLatencyModule from "./modules/stream-latency/stream-latency-module.tsx";
import type TwitchModule from "./twitch.module.ts";
import TwitchUtils from "./twitch.utils.ts";

export default class TwitchPlatform extends Platform<TwitchModule, TwitchEvents, TwitchStorage> {
	constructor() {
		super({ type: "twitch" });
	}

	protected readonly twitchUtils = new TwitchUtils(this.utilsRepository.reactUtils);
	protected readonly twitchApi = new TwitchApi();

	protected getModules(): TwitchModule[] {
		const dependencies = [
			this.emitter,
			this.storageRepository,
			this.utilsRepository,
			this.enhancerApi,
			this.workerApi,
			this.twitchUtils,
			this.twitchApi,
		] as const;
		return [
			new ExampleModule(...dependencies),
			new StreamLatencyModule(...dependencies),
			new ClipDownloadModule(...dependencies),
			new ChatModule(...dependencies),
			new ChatCopyEmoteModule(...dependencies),
			new ChatHighlightUserModule(...dependencies),
			new ChannelSectionModule(...dependencies),
			new ChatAttachmentsModule(...dependencies),
			new ChatBadgesModule(...dependencies),
			new PinStreamerModule(...dependencies),
			new ChattersModule(...dependencies),
			new WatchTimeModule(...dependencies),
			new ChatMessagePopupModule(...dependencies),
			new RealVideoTimeModule(...dependencies),
			new PinStreamerModule(...dependencies),
			new WatchTimeModule(...dependencies),
			new SettingsButtonModule(...dependencies),
		];
	}
}
