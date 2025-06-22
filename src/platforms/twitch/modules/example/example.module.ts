import type { TwitchModuleConfig } from "$types/shared/module/module.types.ts";
import TwitchModule from "../../twitch.module.ts";

export default class ExampleModule extends TwitchModule {
	readonly config: TwitchModuleConfig = {
		name: "example",
		appliers: [
			{
				type: "event",
				event: "extension:start",
				callback: () => {
					this.logger.debug("Example module loaded");
				},
				key: "essa",
			},
		],
	};
}
