import Module from "module/module.ts";
import type { TwitchEvents } from "types/events/twitch/events";
import type { TwitchLocalStorageMap } from "types/storage/twitch/local.storage";

export default class TwitchModule extends Module<
	TwitchEvents,
	TwitchLocalStorageMap
> {}
