import type { TwitchChatMessage } from "events/twitch/chat.ts";
import type Logger from "logger";
import { createNanoEvents } from "nanoevents";
import type CommonUtils from "utils/common.utils.ts";

export default abstract class ChatMessageListener {
	readonly emitter = createNanoEvents<TwitchChatMessageEvents>();
	constructor(
		protected readonly logger: Logger,
		protected readonly utils: CommonUtils,
	) {}

	abstract inject(): void;
}

type TwitchChatMessageEvents = {
	inject: () => void;
	message: (message: TwitchChatMessage) => void;
};
