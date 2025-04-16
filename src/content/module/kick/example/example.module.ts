import type { ModuleConfig } from "types/content/module/module.types.ts";
import Module from "../../module.ts";

export default class ExampleModule extends Module {
	config: ModuleConfig = {
		name: "example-module",
		appliers: [
			{
				type: "selector",
				key: "test",
				selectors: ["#sidebar-wrapper"],
				callback: this.handleSelector.bind(this),
				cooldown: 3000,
				once: true,
			},
		],
	};

	private handleSelector(elements: Element[]) {
		const list = elements[0].querySelectorAll("li");
		list.forEach((ul) => {
			ul.textContent = "Enhanced";
		});
	}
}
