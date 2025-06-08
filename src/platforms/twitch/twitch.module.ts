import Module from "$shared/module/module.ts";
import type UtilsRepository from "$shared/utils/utils.repository.ts";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import type { Emitter } from "nanoevents";
import type TwitchApi from "./apis/twitch.api.ts";
import type TwitchUtils from "./twitch.utils.ts";

export default abstract class TwitchModule extends Module<TwitchEvents> {
	constructor(
		emitter: Emitter<TwitchEvents>,
		utilsRepository: UtilsRepository,
		private readonly _twitchUtils: TwitchUtils,
		private readonly _twitchApi: TwitchApi,
	) {
		super(emitter, utilsRepository);
	}

	protected twitchUtils() {
		return this._twitchUtils;
	}

	protected twitchApi() {
		return this._twitchApi;
	}
}
