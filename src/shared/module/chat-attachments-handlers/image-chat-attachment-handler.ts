import ChatAttachmentHandler from "$shared/module/chat-attachments-handlers/chat-attachment-handler.ts";
import type {
	AttachmentUrlParser,
	BaseChatAttachmentData,
	ChatAttachmentData,
} from "$types/shared/module/chat-attachment/chat-attachment.types.ts";

export default class ImageChatAttachmentHandler extends ChatAttachmentHandler {
	static readonly MAX_FILE_SIZE = 10000000;
	static readonly ALLOWED_HOSTS = [
		"media.giphy.com",
		"c.tenor.com",
		"media.discordapp.net",
		"cdn.discordapp.com",
		"images-ext-1.discordapp.net",
		"images-ext-2.discordapp.net",
		"images.discordapp.net",
		"imagizer.imageshack.com",
		"imgur.com",
		"i.imgur.com",
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

	static readonly DISCORD_CACHE_PREVIEW_PARSER = (url: URL) => {
		const previewUrl = new URL("https://preview.enhancer.at");
		previewUrl.searchParams.append("type", "image");
		previewUrl.searchParams.append("preview", url.href);
		return previewUrl;
	};
	static readonly PREVIEW_URL_PARSERS: AttachmentUrlParser = {
		"images-ext-1.discordapp.net": ImageChatAttachmentHandler.DISCORD_CACHE_PREVIEW_PARSER,
		"images-ext-2.discordapp.net": ImageChatAttachmentHandler.DISCORD_CACHE_PREVIEW_PARSER,
	};

	validate(baseData: BaseChatAttachmentData) {
		return (
			ImageChatAttachmentHandler.ALLOWED_HOSTS.some((host) => baseData.url.host === host) &&
			!this.isImgurAlbum(baseData.url)
		);
	}

	async applies(data: ChatAttachmentData) {
		return data.attachmentSize < ImageChatAttachmentHandler.MAX_FILE_SIZE;
	}

	async handle(data: ChatAttachmentData) {
		const element = data.messageElement as HTMLLinkElement;
		const image = new Image();
		const imageSource = this.parseUrl(data.url).href;
		image.classList.add("enhancer-chat-image");
		image.src = imageSource;
		image.onload = () => {
			const imageContainer = document.createElement("div");
			imageContainer.classList.add("enhancer-chat-image-container");
			imageContainer.appendChild(image);

			element.href = this.parsePreviewUrl(data.url).href;
			element.classList.add("enhancer-chat-link");
			element.replaceChildren(imageContainer);
			this.loadedCallback();
		};
		image.onerror = () => {
			this.logger.warn("Failed to load image");
		};
	}

	private parseUrl(url: URL): URL {
		return ImageChatAttachmentHandler.URL_PARSERS[url.host]?.(url) ?? url;
	}

	private parsePreviewUrl(url: URL): URL {
		return ImageChatAttachmentHandler.PREVIEW_URL_PARSERS[url.host]?.(url) ?? url;
	}

	private isImgurAlbum(url: URL) {
		return url.host === "i.imgur.com" && url.pathname.includes("/a/");
	}
}
