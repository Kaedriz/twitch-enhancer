import Module from "module/core/module.ts";
import type { ModuleConfig } from "types/module/module.types.ts";

export default class ExampleModule extends Module {
	config: ModuleConfig = {
		name: "example-module",
		appliers: [
			{
				type: "selector",
				key: "test",
				selectors: ["#test"],
				callback: this.handleSelector.bind(this),
				validateUrl: (url) => {
					return url.includes("dashboard");
				},
				cooldown: 3000,
			},
			{
				type: "event",
				key: "test",
				event: "extension:start",
				callback: this.handleEvent.bind(this),
			},
		],
	};

	private handleSelector(elements: Element[]) {}

	private handleEvent() {}
}
