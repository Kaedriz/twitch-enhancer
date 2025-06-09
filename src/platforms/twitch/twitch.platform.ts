import Platform from "$shared/platform/platform.ts";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import ClipDownloadModule from "./modules/clip-download/clip-download-module.tsx";
import ExampleModule from "./modules/example/example.module.ts";
import StreamLatencyModule from "./modules/stream-latency/stream-latency-module.tsx";
import type TwitchModule from "./twitch.module.ts";
import TwitchUtils from "./twitch.utils.ts";
import ChatModule from "./modules/chat/chat-module.tsx";
import ChatCopyEmoteModule from "./modules/chat-copy-emote/chat-copy-emote-module.tsx";
import ChatHighlightUserModule from "./modules/chat-highlight-user/chat-highlight-user-module.tsx";
import ChannelSectionModule from "./modules/channel-section/channel-section-module.tsx";

export default class TwitchPlatform extends Platform<TwitchModule, TwitchEvents> {
	constructor() {
		super({ type: "twitch" });
	}

	protected readonly twitchUtils = new TwitchUtils(this.utilsRepository.reactUtils);

	protected getModules(): TwitchModule[] {
		return [
			new ExampleModule(this.emitter, this.utilsRepository, this.twitchUtils),
			new StreamLatencyModule(this.emitter, this.utilsRepository, this.twitchUtils),
			new ClipDownloadModule(this.emitter, this.utilsRepository, this.twitchUtils),
			new ChatModule(this.emitter, this.utilsRepository, this.twitchUtils),
			new ChatCopyEmoteModule(this.emitter, this.utilsRepository, this.twitchUtils),
			new ChatHighlightUserModule(this.emitter, this.utilsRepository, this.twitchUtils),
			new ChannelSectionModule(this.emitter, this.utilsRepository, this.twitchUtils),
		];
	}
}
