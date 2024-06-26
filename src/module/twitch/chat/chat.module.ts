import TwitchModule from "../twitch-module.ts";

export default class ChatModule extends TwitchModule {
	private chat: Element | undefined;
	private is7TV = false;

	async initialize(): Promise<void> {}

	async canRun(): Promise<boolean> {
		const temporaryChat =
			document.querySelector(".chat-scrollable-area__message-container") ||
			document.querySelector(".seventv-chat-list");
		if (!temporaryChat) return false;
		if (this.utils.isElementAlreadyUsed(temporaryChat)) return false;
		this.is7TV = temporaryChat.className.includes("seventv");
		this.chat = temporaryChat;
		return true;
	}

	async run() {
		if (!this.chat) throw new Error("Chat is undefined");
		this.utils.markElementAsUsed(this.chat);
	}
}
