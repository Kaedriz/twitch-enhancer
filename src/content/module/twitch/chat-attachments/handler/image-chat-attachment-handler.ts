import ChatAttachmentHandler from "module/twitch/chat-attachments/handler/chat-attachment-handler.ts";
import type {
	AttachmentUrlParser,
	BaseChatAttachmentData,
	ChatAttachmentData,
} from "types/content/module/twitch/chat-attachment.types.ts";

export default class ImageChatAttachmentHandler extends ChatAttachmentHandler {
	static readonly MAX_FILE_SIZE = 10000000;
	static readonly ALLOWED_HOSTS = [
		"media.giphy.com",
		"i.imgur.com",
		"c.tenor.com",
		"media.discordapp.net",
		"cdn.discordapp.com",
		"imagizer.imageshack.com",
		"imgur.com",
		"i.nuuls.com",
		"kappa.lol",
	];
	static readonly URL_PARSERS: AttachmentUrlParser = {
		"cdn.discordapp.com": (url) => {
			url.host = "media.discordapp.net";
			return url;
		},
		"imgur.com": (url) => {
			url.host = "i.imgur.com";
			url.pathname = `${url.pathname}.gif`;
			return url;
		},
	};

	validate(baseData: BaseChatAttachmentData) {
		return (
			ImageChatAttachmentHandler.ALLOWED_HOSTS.some((host) => baseData.url.host.endsWith(host)) &&
			!this.isImgurAlbum(baseData.url)
		);
	}

	async applies(data: ChatAttachmentData) {
		return data.attachmentSize < ImageChatAttachmentHandler.MAX_FILE_SIZE;
	}

	async handle(data: ChatAttachmentData) {
		const element = data.messageElement;
		const image = new Image();
		const imageSource = this.parseUrl(data.url).href;
		image.classList.add("enhancer-chat-image");
		image.src = imageSource;
		image.onload = () => {
			element.classList.add("enhancer-chat-link");
			element.replaceChildren(image);
			this.loadedCallback();
		};
		image.onerror = () => {
			this.logger.warn("Failed to load image");
		};
	}

	private parseUrl(url: URL): URL {
		return ImageChatAttachmentHandler.URL_PARSERS[url.host]?.(url) ?? url;
	}

	private isImgurAlbum(url: URL) {
		return url.host === "i.imgur.com" && url.pathname.includes("/a/");
	}
}
