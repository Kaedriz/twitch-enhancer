import type ReactUtils from "$shared/utils/react.utils.ts";

import type { KickChatMessageData } from "$types/platforms/kick/kick.events.types.ts";

export default class KickUtils {
	constructor(protected readonly reactUtils: ReactUtils) {}

	scrollChatToBottom() {
		const chatElement = document.getElementById("chatroom-messages");
		if (chatElement) {
			chatElement.scrollTop = chatElement.scrollHeight;
		}
	}

	getMessageData(messageElement: Element): KickChatMessageData | null {
		const props = this.reactUtils.findReactChildren<KickChatMessageData>(
			this.reactUtils.getReactInstance(messageElement),
			(n) => n.pendingProps?.message,
			100,
		)?.pendingProps;

		if (!props?.message) {
			return null;
		}

		return props.message;
	}

	isNTVInstalled(): boolean {
		return !!(
			document.querySelector(".ntv__chat-message__username") ||
			document.querySelector(".ntv__chat-message__inner") ||
			document.querySelector("[class*='ntv__']")
		);
	}
}
