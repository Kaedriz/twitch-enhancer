import Module from "$shared/module/module.ts";
import type UtilsRepository from "$shared/utils/utils.repository.ts";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import type { Emitter } from "nanoevents";
import type TwitchUtils from "./twitch.utils.ts";

export default abstract class TwitchModule extends Module<TwitchEvents> {
	constructor(
		emitter: Emitter<TwitchEvents>,
		utilsRepository: UtilsRepository,
		private readonly _twitchUtils: TwitchUtils,
	) {
		super(emitter, utilsRepository);
	}

	protected twitchUtils() {
		return this._twitchUtils;
	}
}
