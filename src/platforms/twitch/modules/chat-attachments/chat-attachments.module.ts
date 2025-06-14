import { HttpClient } from "$shared/http/http-client.ts";
import type ChatAttachmentHandler from "$shared/module/chat-attachments-handlers/chat-attachment-handler.ts";
import ImageChatAttachmentHandler from "$shared/module/chat-attachments-handlers/image-chat-attachment-handler.ts";
import TwitchModule from "$twitch/twitch.module.ts";
import type { TwitchChatMessageEvent } from "$types/platforms/twitch/twitch.events.types.ts";
import {
	type BaseChatAttachmentData,
	type ChatAttachmentData,
	ChatAttachmentMessageType,
} from "$types/shared/module/chat-attachment/chat-attachment.types.ts";
import type { TwitchModuleConfig } from "$types/shared/module/module.types.ts";

export default class ChatAttachmentsModule extends TwitchModule {
	config: TwitchModuleConfig = {
		name: "chat-attachments",
		appliers: [
			{
				type: "event",
				key: "chat-attachments",
				event: "twitch:chatMessage",
				callback: this.handleMessage.bind(this),
			},
		],
	};

	private httpClient = new HttpClient();

	private readonly chatAttachmentHandlers: ChatAttachmentHandler[] = [
		new ImageChatAttachmentHandler(this.logger, () => {
			this.twitchUtils().unstuckScroll();
		}),
	];

	private async handleMessage(message: TwitchChatMessageEvent) {
		const baseData = this.getBaseData(message);
		if (!baseData) return;
		const chatAttachmentHandler = this.chatAttachmentHandlers.find((chatAttachmentHandler) =>
			chatAttachmentHandler.validate(baseData),
		);
		if (!chatAttachmentHandler) return;
		const data = await this.getData(baseData);
		if (await chatAttachmentHandler.applies(data)) await chatAttachmentHandler.handle(data);
	}

	private getBaseData(message: TwitchChatMessageEvent): BaseChatAttachmentData | undefined {
		const args = message.message.message.split(" ");
		const links = [...message.element.querySelectorAll("a")] as Element[];
		const firstWord = args.at(0);
		const firstElement = links.at(0);
		const lastWord = args.at(-1);
		const lastElement = links.at(-1);

		if (this.commonUtils().isValidUrl(firstWord) && firstElement) {
			return { messageType: ChatAttachmentMessageType.FIRST, url: new URL(firstWord), messageElement: firstElement };
		}
		if (this.commonUtils().isValidUrl(lastWord) && lastElement) {
			return { messageType: ChatAttachmentMessageType.LAST, url: new URL(lastWord), messageElement: lastElement };
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
