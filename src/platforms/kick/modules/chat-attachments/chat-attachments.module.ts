import KickModule from "$kick/kick.module.ts";
import { HttpClient } from "$shared/http/http-client.ts";
import type ChatAttachmentHandler from "$shared/module/chat-attachments-handlers/chat-attachment-handler.ts";
import ImageChatAttachmentHandler from "$shared/module/chat-attachments-handlers/image-chat-attachment-handler.ts";
import type { KickChatMessage } from "$types/platforms/kick/kick.utils.types.ts";
import {
	type BaseChatAttachmentData,
	type ChatAttachmentData,
	ChatAttachmentMessageType,
} from "$types/shared/module/chat-attachment/chat-attachment.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";

export default class ChatAttachmentsModule extends KickModule {
	readonly config: KickModuleConfig = {
		name: "chat-attachments",
		appliers: [
			{
				type: "event",
				event: "kick:chatMessage",
				callback: this.handleMessage.bind(this),
				key: "chat-attachments",
			},
		],
	};

	private httpClient = new HttpClient();

	private readonly chatAttachmentHandlers: ChatAttachmentHandler[] = [
		new ImageChatAttachmentHandler(this.logger, () => {}),
	];

	private async handleMessage(message: KickChatMessage) {
		const baseData = this.getBaseData(message);
		if (!baseData) return;
		const chatAttachmentHandler = this.chatAttachmentHandlers.find((chatAttachmentHandler) =>
			chatAttachmentHandler.validate(baseData),
		);
		if (!chatAttachmentHandler) return;
		const data = await this.getData(baseData);
		if (await chatAttachmentHandler.applies(data)) await chatAttachmentHandler.handle(data);
	}

	private getBaseData(message: KickChatMessage): BaseChatAttachmentData | undefined {
		const args = message.message.split(" ");
		const firstWord = args.at(0);
		const lastWord = args.at(-1);

		const messageElement = message.element.querySelector("a[href]");

		if (!messageElement) return;

		if (this.commonUtils().isValidUrl(firstWord)) {
			return {
				messageType: ChatAttachmentMessageType.FIRST,
				url: new URL(firstWord),
				messageElement,
			};
		}
		if (this.commonUtils().isValidUrl(lastWord)) {
			return {
				messageType: ChatAttachmentMessageType.LAST,
				url: new URL(lastWord),
				messageElement,
			};
		}
	}

	private async getData(baseData: BaseChatAttachmentData): Promise<ChatAttachmentData> {
		const attachmentData = await this.getAttachmentData(baseData.url);
		if (!attachmentData || !attachmentData.type || !attachmentData.size)
			throw new Error("Couldn't get attachment data");
		return { ...baseData, attachmentType: attachmentData.type, attachmentSize: Number.parseInt(attachmentData.size) };
	}

	private async getAttachmentData(url: URL) {
		try {
			const { response } = await this.commonUtils().request(url.href, {
				//TODO to fix
				method: "HEAD",
				responseType: "raw",
			});
			return { type: response.headers.get("Content-Type"), size: response.headers.get("Content-Length") };
		} catch (error) {
			this.logger.warn("Couldn't get attachment data", error);
		}
	}

	async initialize() {
		this.commonUtils().createGlobalStyle(`
			.enhancer-chat-link {
				display: inline-block;
				text-decoration: none;
			}
			
			.enhancer-chat-image-container {
				display: inline-block;
				margin: 0.5rem 0;
				max-width: 100%;
			}
			
			.enhancer-chat-image {
				min-height: 16px;
				max-height: 256px;
				width: auto;
				max-width: 100%;
				display: block;
			}`);
	}
}
