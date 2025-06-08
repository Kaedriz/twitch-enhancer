import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import type { ModuleConfig } from "$types/shared/module.types.ts";
import TwitchModule from "../../twitch.module.ts";

export default class ExampleModule extends TwitchModule {
	readonly config: ModuleConfig<TwitchEvents> = {
		name: "example",
		appliers: [
			{
				type: "event",
				event: "extension:start",
				callback: () => {
					console.info("essa");
				},
				key: "essa",
			},
		],
	};
}
