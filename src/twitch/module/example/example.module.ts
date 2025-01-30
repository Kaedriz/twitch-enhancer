import Module from "module/module.ts";
import type { ModuleConfig } from "types/module/module.ts";

export default class ExampleModule extends Module {
	config: ModuleConfig = {
		name: "example-module",
		// appliers: [
		// 	{
		// 		type: "selector",
		// 		selectors: ["#test"],
		// 		callback: this.handle.bind(this),
		// 		validateUrl: (url) => {
		// 			return url.includes("dashboard");
		// 		},
		// 		cooldown: 3000,
		// 	},
		// 	{
		// 		type: "event",
		// 		event: "twitch:message",
		// 		callback: this.handleMessage.bind(this),
		// 	},
		// ],
		appliers: [
			{
				type: "selector",
				key: "test",
				selectors: ["#test"],
				callback: this.handle.bind(this),
				validateUrl: (url) => {
					return url.includes("dashboard");
				},
				cooldown: 3000,
			},
			{
				type: "event",
				key: "test",
				event: "twitch:message",
				callback: this.handleStart.bind(this),
			},
		],
	};

	private handle(elements: Element[], key: string) {
		this.logger.info("Handled start event");
	}

	private handleStart() {
		this.logger.info("Handled start event");
	}
}
