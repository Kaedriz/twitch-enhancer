import type ReactUtils from "$shared/utils/react.utils.ts";

export default class KickUtils {
	constructor(protected readonly reactUtils: ReactUtils) {}

	getSigma() {
		return "sigma";
	}

	scrollChatToBottom() {
		const chatElement = document.getElementById("chatroom-messages");
		if (chatElement) {
			chatElement.scrollTop = chatElement.scrollHeight;
		}
	}
}
