import Module from "module/core/module.ts";
import type { ModuleConfig } from "types/module/module.types.ts";

export default class ExampleModule extends Module {
	config: ModuleConfig = {
		name: "example-module",
		appliers: [
			{
				type: "selector",
				key: "test",
				selectors: [".tw-title"],
				callback: this.handleSelector.bind(this),
				validateUrl: (url) => {
					return !url.includes("dashboard");
				},
				cooldown: 3000,
				once: true,
			},
			{
				type: "event",
				key: "test",
				event: "extension:start",
				callback: this.handleEvent.bind(this),
			},
		],
	};

	private handleSelector(elements: Element[]) {
		this.logger.info("Found these elements:", elements);
	}

	private handleEvent() {
		this.logger.info("Handled extension:start!");
	}
}
