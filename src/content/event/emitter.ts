import { createNanoEvents } from "nanoevents";
import type { EventsMap } from "types/content/event/events.types.ts";

export function createEventsEmitter() {
	return createNanoEvents<EventsMap>();
}
