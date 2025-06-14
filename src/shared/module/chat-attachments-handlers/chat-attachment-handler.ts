import type {
	BaseChatAttachmentData,
	ChatAttachmentData,
} from "$types/shared/module/chat-attachment/chat-attachment.types.ts";
import type { Logger } from "$shared/logger/logger.ts";

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
