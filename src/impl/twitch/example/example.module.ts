import type { TwitchEvents } from "events/twitch/events.ts";
import Module from "module/module.ts";
import type { ModuleConfig, ModuleEvent } from "module/types.ts";
import type { TwitchLocalStorageMap } from "../../../storage/twitch/local.storage.types.ts";

export default class ExampleModule extends Module<
	TwitchEvents,
	TwitchLocalStorageMap
> {
	protected config(): ModuleConfig {
		return {
			name: "example",
			elements: [
				{
					selector: "test selector",
					useParent: true,
					once: true,
					urlConfig: {
						type: "include",
						regex: /x/,
						check: (url) => ["test.com"].includes(url),
					},
				},
			],
			platform: "twitch",
		};
	}

	protected async run(event: ModuleEvent) {}
}
