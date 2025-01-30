import ModuleApplierValidator from "module/applier/module.appliter-validator.ts";
import type Module from "module/module.ts";
import { createNanoEvents } from "nanoevents";
import type { EventsMap } from "types/events/events.ts";
import type { KickEvents } from "types/events/kick.events.ts";
import type { TwitchEvents } from "types/events/twitch.events.ts";
import {
	type EventModuleApplier,
	type KickEventModuleApplier,
	type ModuleApplierResult,
	type ModuleApplierResultSuccess,
	type ModuleApplierType,
	SelectorModuleApplier,
	type TwitchEventModuleApplier,
} from "types/module/module.applier.ts";

export default class EventModuleApplierValidator extends ModuleApplierValidator<
	EventModuleApplier,
	keyof (TwitchEvents & KickEvents)
> {
	private readonly caller = createNanoEvents<TwitchEvents & KickEvents>();

	type: ModuleApplierType = "event";

	applies(
		config: EventModuleApplier,
	): ModuleApplierResult<keyof (TwitchEvents & KickEvents)> {
		return { applies: true, data: config.event };
	}

	apply(
		config: EventModuleApplier,
		result: ModuleApplierResultSuccess<keyof TwitchEvents & KickEvents>,
	) {
		this.caller.on(result.data, config.callback);
	}
}
