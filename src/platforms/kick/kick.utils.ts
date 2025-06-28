import type ReactUtils from "$shared/utils/react.utils.ts";

import type { KickChatMessageData } from "$types/platforms/kick/kick.events.types.ts";
import type { ChatRoomComponent } from "$types/platforms/kick/kick.utils.types.ts";

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

	getChatRoomComponent(): ChatRoomComponent | undefined {
		const element = document.querySelector("#chatroom-messages");
		if (!element) return;
		const instance = this.reactUtils.getReactInstance(element);
		if (!instance) return;
		return instance?.return?.memoizedProps;
	}

	isUsingNTV(element?: Element): boolean {
		const elementToSerach = element ?? document;
		return !!(
			elementToSerach.querySelector(".ntv__chat-message__username") ||
			elementToSerach.querySelector(".ntv__chat-message__inner") ||
			elementToSerach.querySelector("[class*='ntv__']")
		);
	}
}
