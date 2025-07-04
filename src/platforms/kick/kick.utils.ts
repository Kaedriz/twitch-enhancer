import type ReactUtils from "$shared/utils/react.utils.ts";
import type { KickChatMessageData } from "$types/platforms/kick/kick.events.types.ts";
import type { ChannelChatRoom, ChannelChatRoomInfo, ChannelInfo } from "$types/platforms/kick/kick.utils.types.ts";

export default class KickUtils {
	constructor(protected readonly reactUtils: ReactUtils) {}

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

	getChannelInfo() {
		return this.reactUtils.findReactParents<never, ChannelInfo>(
			this.reactUtils.getReactInstance(document.querySelector("main")),
			(n) => !!n?.memoizedProps.channelId && !!n?.memoizedProps.slug,
		)?.memoizedProps;
	}

	getChannelChatRoomInfo() {
		return this.reactUtils.findReactParents<never, ChannelChatRoomInfo>(
			this.reactUtils.getReactInstance(document.querySelector("#channel-chatroom")),
			(n) => !!n.memoizedProps.slug,
		)?.memoizedProps;
	}

	getChannelChatRoom() {
		return this.reactUtils.findReactChildren<never, ChannelChatRoom>(
			this.reactUtils.getReactInstance(document.querySelector("#channel-chatroom")),
			(n) => !!n.memoizedProps.messages && !!n.memoizedProps.setIsPaused,
		)?.memoizedProps;
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
