import { createNanoEvents } from "nanoevents";
import type { EventsMap } from "types/events/events.ts";

export function createEventsEmitter() {
	return createNanoEvents<EventsMap>();
}
