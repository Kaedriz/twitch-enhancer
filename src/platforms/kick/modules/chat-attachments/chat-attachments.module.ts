import KickModule from "$kick/kick.module.ts";
import { HttpClient } from "$shared/http/http-client.ts";
import type ChatAttachmentHandler from "$shared/module/chat-attachments-handlers/chat-attachment-handler.ts";
import ImageChatAttachmentHandler from "$shared/module/chat-attachments-handlers/image-chat-attachment-handler.ts";
import type { KickChatMessageEvent } from "$types/platforms/kick/kick.events.types.ts";
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

	private async handleMessage(message: KickChatMessageEvent) {
		const baseData = this.getBaseData(message);
		if (!baseData) return;
		const chatAttachmentHandler = this.chatAttachmentHandlers.find((chatAttachmentHandler) =>
			chatAttachmentHandler.validate(baseData),
		);
		if (!chatAttachmentHandler) return;
		baseData.url = chatAttachmentHandler.parseUrl(baseData.url);
		const data = await this.getData(baseData);
		if (await chatAttachmentHandler.applies(data)) await chatAttachmentHandler.handle(data);
	}

	private getBaseData(message: KickChatMessageEvent): BaseChatAttachmentData | undefined {
		const args = message.message.content?.split(" ") ?? [];
		const firstWord = args.at(0) || "";
		const lastWord = args.at(-1) || "";

		const links = message.isUsingNTV
			? [...message.element.querySelectorAll(".ntv__chat-message__inner .ntv__chat-message__part")]
			: [...message.element.querySelectorAll("a[href]")];

		const firstElement = links.at(0);
		const lastElement = links.at(-1);

		if (this.commonUtils().isValidUrl(firstWord) && firstElement) {
			return {
				messageType: ChatAttachmentMessageType.FIRST,
				url: new URL(firstWord),
				messageElement: firstElement,
			};
		}
		if (this.commonUtils().isValidUrl(lastWord) && lastElement) {
			return {
				messageType: ChatAttachmentMessageType.LAST,
				url: new URL(lastWord),
				messageElement: lastElement,
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
				width: fit-content;
				margin: 0.5rem 0;
			}
			
			.enhancer-chat-image {
				min-height: 16px;
				max-height: 256px;
				width: 100%;
			}`);
	}
}
