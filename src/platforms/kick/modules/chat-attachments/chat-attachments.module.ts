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

	private readonly httpClient = new HttpClient();

	private readonly chatAttachmentHandlers: ChatAttachmentHandler[] = [
		new ImageChatAttachmentHandler(this.logger, () => {
			this.kickUtils().scrollChatToBottom();
		}),
	];

	private async handleMessage(message: KickChatMessage) {
		const baseData = this.getBaseData(message);
		if (!baseData) return;
		const chatAttachmentHandler = this.chatAttachmentHandlers.find((chatAttachmentHandler) =>
			chatAttachmentHandler.validate(baseData),
		);
		const url = chatAttachmentHandler?.parseUrl(baseData.url);
		if (url) baseData.url = url;
		if (!chatAttachmentHandler) return;
		const data = await this.getData(baseData);
		if (await chatAttachmentHandler.applies(data)) await chatAttachmentHandler.handle(data);
	}

	private getBaseData(message: KickChatMessage): BaseChatAttachmentData | undefined {
		const args = message.message?.split(" ") ?? [];
		const firstWord = args.at(0) || '';
		const lastWord = args.at(-1) || '';

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
		if (!attachmentData?.type || !attachmentData?.size || attachmentData === undefined)
			throw new Error("Couldn't get attachment data");
		return { ...baseData, attachmentType: attachmentData.type, attachmentSize: Number.parseInt(attachmentData.size) };
	}

	private async getAttachmentData(url: URL) {
		try {
			const { response } = await this.httpClient.request(url.href, {
				method: "HEAD",
				responseType: "text",
			});
			return { type: response.headers.get("Content-Type"), size: response.headers.get("Content-Length") };
		} catch (error) {
			this.logger.warn("Couldn't get attachment data", error);
		}
	}

	async initialize() {
		this.commonUtils().createGlobalStyle(`
			.enhancer-chat-link {
				display: block;
				text-decoration: none;
				width: 100%;
			}
			
			.enhancer-chat-image {
				max-width: 100%;
				max-height: 256px;
				width: auto;
				height: auto;
				display: block;
				margin-top: 4px;
			}`);
	}
}
