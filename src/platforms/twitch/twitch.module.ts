import type EnhancerApi from "$shared/apis/enhancer.api.ts";
import Module from "$shared/module/module.ts";
import type UtilsRepository from "$shared/utils/utils.repository.ts";
import type TwitchApi from "$twitch/apis/twitch.api.ts";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import type { Emitter } from "nanoevents";
import type TwitchUtils from "./twitch.utils.ts";

export default abstract class TwitchModule extends Module<TwitchEvents> {
	constructor(
		emitter: Emitter<TwitchEvents>,
		utilsRepository: UtilsRepository,
		enhancerApi: EnhancerApi,
		private readonly _twitchUtils: TwitchUtils,
		private readonly _twitchApi: TwitchApi,
	) {
		super(emitter, utilsRepository, enhancerApi);
	}

	protected twitchUtils() {
		return this._twitchUtils;
	}

	protected twitchApi() {
		return this._twitchApi;
	}
}
