import type { PlatformConfig } from "$types/shared/platform.types.ts";
import Platform from "$shared/platform.ts";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import TwitchUtils from "./twitch.utils.ts";
import type TwitchModule from "./twitch.module.ts";
import ExampleModule from "./modules/example/example.module.ts";

export default class TwitchPlatform extends Platform<TwitchModule, TwitchEvents> {
	protected readonly config: PlatformConfig = {
		type: "twitch",
	};

	protected readonly twitchUtils = new TwitchUtils(this.utilsRepository.reactUtils);

	async initialize() {}

	protected getModules(): TwitchModule[] {
		return [new ExampleModule(this.emitter, this.utilsRepository)];
	}
}
