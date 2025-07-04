import KickModule from "$kick/kick.module.ts";
import { HttpClient } from "$shared/http/http-client.ts";
import type ChatAttachmentHandler from "$shared/module/chat-attachments/chat-attachment-handler.ts";
import ImageChatAttachmentHandler from "$shared/module/chat-attachments/image-chat-attachment-handler.ts";
import { ImageChatAttachmentConfig } from "$shared/module/chat-attachments/image-chat-attachment.config.ts";
import type { KickChatMessageEvent } from "$types/platforms/kick/kick.events.types.ts";
import {
	type BaseChatAttachmentData,
	type ChatAttachmentData,
	ChatAttachmentMessageType,
} from "$types/shared/module/chat-attachment/chat-attachment.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";

export default class ChatAttachmentsModule extends KickModule {
	private readonly httpClient = new HttpClient();
	private readonly imageAttachmentConfig = new ImageChatAttachmentConfig(this.settingsService(), async () => {
		const chatRoom = this.kickUtils().getChannelChatRoom();
		if (!chatRoom) return;
		if (!chatRoom.isPaused) {
			chatRoom.setIsPaused(true);
			await this.commonUtils().delay(10);
			chatRoom.setIsPaused(false);
		}
	});

	private static NTV_MESSAGE_SUFFIX = " 󠀡";

	readonly config: KickModuleConfig = {
		name: "chat-attachments",
		appliers: [
			{
				type: "event",
				event: "kick:chatMessage",
				callback: this.handleMessage.bind(this),
				key: "chat-attachments",
			},
			{
				type: "event",
				key: "settings-chat-images-size",
				event: "kick:settings:chatImagesSize",
				callback: (size) => this.imageAttachmentConfig.updateMaxFileSize(size),
			},
			{
				type: "event",
				key: "settings-chat-images-on-hover",
				event: "kick:settings:chatImagesOnHover",
				callback: (enabled) => this.imageAttachmentConfig.updateImagesOnHover(enabled),
			},
			{
				type: "event",
				key: "settings-chat-images-enabled",
				event: "kick:settings:chatImagesEnabled",
				callback: (enabled) => {
					this.logger.debug(enabled);
					this.isModuleEnabled = enabled;
				},
			},
		],
		isModuleEnabled: () => this.settingsService().getSettingsKey("chatImagesEnabled"),
	};

	private readonly chatAttachmentHandlers: ChatAttachmentHandler[] = [
		new ImageChatAttachmentHandler(this.logger, this.imageAttachmentConfig),
	];

	private async handleMessage(message: KickChatMessageEvent) {
		this.logger.debug("Handling chat message event");
		if (!this.isModuleEnabled) return;
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
		const args = message.message.content?.replaceAll(ChatAttachmentsModule.NTV_MESSAGE_SUFFIX, "")?.split(" ") ?? [];
		const firstWord = args.at(0) || "";
		const lastWord = args.at(-1) || "";

		const links = [
			...message.element.querySelectorAll(`${message.isUsingNTV ? ".ntv__chat-message__inner " : ""}a[href]`),
		];

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
		await this.imageAttachmentConfig.initialize();
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
			}

			.enhancer-chat-image-blurred {
				filter: blur(5px);
			}

			.enhancer-chat-image-blurred:hover {
				filter: blur(0);
			}`);
	}
}
