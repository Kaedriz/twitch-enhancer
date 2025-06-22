import KickModule from "$kick/kick.module.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";

export default class ExampleModule extends KickModule {
	readonly config: KickModuleConfig = {
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
