import Module from "module/module.ts";
import type { TwitchEvents } from "types/events/twitch/events.d.ts";
import type { ModuleConfig, ModuleEvent } from "types/module/module.ts";
import type { TwitchLocalStorageMap } from "types/storage/twitch/local.storage.d.ts";

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
