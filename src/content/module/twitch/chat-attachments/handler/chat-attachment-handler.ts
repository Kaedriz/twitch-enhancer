import type Logger from "logger";
import type { BaseChatAttachmentData, ChatAttachmentData } from "types/content/module/twitch/chat-attachment.types.ts";

export default abstract class ChatAttachmentHandler {
	constructor(
		protected readonly logger: Logger,
		protected readonly loadedCallback: () => void,
	) {}

	abstract validate(baseData: BaseChatAttachmentData): boolean;

	async applies(data: ChatAttachmentData): Promise<boolean> {
		throw new Error("Not implemented");
	}

	async handle(data: ChatAttachmentData) {
		throw new Error("Not implemented");
	}
}
