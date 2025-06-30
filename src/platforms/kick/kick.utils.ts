import type ReactUtils from "$shared/utils/react.utils.ts";
import type { KickChatMessageData } from "$types/platforms/kick/kick.events.types.ts";
import type {
	IsoDateProps,
	VideoProgressProps,
	getChannelSectionInfoComponent,
} from "$types/platforms/kick/kick.utils.types.ts";

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

	getChannelSectionInfoComponent() {
		return this.reactUtils.findReactParents<never, getChannelSectionInfoComponent>(
			this.reactUtils.getReactInstance(document.querySelector("#channel-content")),
			(n) => !!n?.memoizedProps.channelId && !!n?.memoizedProps.slug,
		)?.memoizedProps;
	}

	getIsoDateProps() {
		return this.reactUtils.findReactChildren<IsoDateProps>(
			this.reactUtils.getReactInstance(document.querySelector("main")),
			(n) => {
				return !!n?.memoizedProps?.isoDate;
			},
			1000,
		)?.memoizedProps;
	}

	getVideoElement() {
		const videoElement = document.querySelector("video");
		if (videoElement) {
			return videoElement;
		}
		return null;
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
