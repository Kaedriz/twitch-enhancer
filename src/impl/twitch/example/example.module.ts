import Module from "module/module.ts";
import type { ModuleConfig, ModuleEvent } from "module/types.ts";

export default class ExampleModule extends Module {
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
