import Platform from "$shared/platform/platform.ts";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import ExampleModule from "./modules/example/example.module.ts";
import type TwitchModule from "./twitch.module.ts";
import TwitchUtils from "./twitch.utils.ts";

export default class TwitchPlatform extends Platform<TwitchModule, TwitchEvents> {
	constructor() {
		super({ type: "twitch" });
	}

	protected readonly twitchUtils = new TwitchUtils(this.utilsRepository.reactUtils);

	protected getModules(): TwitchModule[] {
		return [new ExampleModule(this.emitter, this.utilsRepository, this.twitchUtils)];
	}
}
