import type Logger from "logger";
import { createNanoEvents } from "nanoevents";
import type { TwitchChatMessage } from "types/utils/twitch-utils.types.ts";
import type UtilsRepository from "utils/utils-repository.ts";

export default abstract class ChatMessageListener {
	readonly emitter = createNanoEvents<TwitchChatMessageEvents>();
	constructor(
		protected readonly logger: Logger,
		protected readonly utilsRepository: UtilsRepository,
	) {}

	abstract inject(): void;
}

type TwitchChatMessageEvents = {
	inject: () => void;
	message: (message: TwitchChatMessage) => void;
};
