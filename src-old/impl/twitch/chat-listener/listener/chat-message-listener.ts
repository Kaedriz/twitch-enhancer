import type Logger from "logger";
import { createNanoEvents } from "nanoevents";
import type { TwitchChatMessage } from "types/events/twitch/chat.events.d.ts";
import type Utils from "utils/utils.ts";

export default abstract class ChatMessageListener {
	readonly emitter = createNanoEvents<TwitchChatMessageEvents>();
	constructor(
		protected readonly logger: Logger,
		protected readonly utils: Utils,
	) {}

	abstract inject(): void;
}

type TwitchChatMessageEvents = {
	inject: () => void;
	message: (message: TwitchChatMessage) => void;
};
