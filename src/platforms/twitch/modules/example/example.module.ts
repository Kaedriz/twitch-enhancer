import TwitchModule from "../../twitch.module.ts";
import type { ModuleConfig } from "$types/shared/module.types.ts";

export default class ExampleModule extends TwitchModule {
	protected config: ModuleConfig = {
		name: "example",
	};
}
