import Platform from "$shared/platform/platform.ts";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import ExampleModule from "./modules/example/example.module.ts";
import type TwitchModule from "./twitch.module.ts";
import TwitchUtils from "./twitch.utils.ts";
import TwitchApi from "./apis/twitch.api.ts";
import ChattersModule from "./modules/chatters/chatters.module.tsx";

export default class TwitchPlatform extends Platform<TwitchModule, TwitchEvents> {
	constructor() {
		super({ type: "twitch" });
	}

	protected readonly twitchUtils = new TwitchUtils(this.utilsRepository.reactUtils);
	protected readonly twitchApi = new TwitchApi();

	protected getModules(): TwitchModule[] {
		return [
			new ExampleModule(this.emitter, this.utilsRepository, this.twitchUtils, this.twitchApi),
			new ChattersModule(this.emitter, this.utilsRepository, this.twitchUtils, this.twitchApi),
		];
	}
}
