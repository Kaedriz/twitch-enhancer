import type Logger from "logger";
import type {
	Chat,
	ChatControllerComponent,
	ChatInfo,
	ChatInput,
	Command,
	FollowedSection,
	MediaPlayerComponent,
	PersistentPlayerComponent,
	ScrollableChatComponent,
	TwitchChatMessageComponent,
} from "types/content/utils/twitch-utils.types.ts";
import type ReactUtils from "utils/react-utils.ts";
import Utils from "utils/utils.ts";

export default class TwitchUtils extends Utils {
	constructor(
		logger: Logger,
		protected readonly reactUtils: ReactUtils,
	) {
		super(logger);
	}

	getCurrentChannelByUrl() {
		let url = window.location.href;
		url = url.replace(/(^\w+:|^)\/\//, "");
		const elements = url.split("/");
		let name = elements[1];
		if (name === "popout" || elements[0].includes("dashboard")) name = elements[2];
		if (name.includes("?")) name = name.substring(0, name.indexOf("?"));
		return name.toLowerCase();
	}

	getUserIdBySideElement(element: Element): string | undefined {
		return this.reactUtils.findReactChildren<number>(
			this.reactUtils.getReactInstance(element),
			(n) => !!n.pendingProps?.userID,
			20,
		)?.pendingProps?.userID;
	}

	getMediaPlayerInstance() {
		return this.reactUtils.findReactChildren<MediaPlayerComponent>(
			this.reactUtils.getReactInstance(document.querySelector(".persistent-player")),
			(n) => !!n.stateNode?.props?.mediaPlayerInstance,
			20,
		)?.stateNode.props.mediaPlayerInstance;
	}

	getPersonalSections() {
		return this.reactUtils.findReactParents<FollowedSection>(
			this.reactUtils.getReactInstance(document.querySelector(".side-nav-section")),
			(n) => !!n.stateNode?.props?.section,
			1000,
		)?.stateNode;
	}

	getPersistentPlayer() {
		return this.reactUtils.findReactChildren<PersistentPlayerComponent>(
			this.reactUtils.getReactInstance(document.querySelector(".persistent-player")),
			(n) => !!n.stateNode?.props?.content.channelLogin,
		)?.stateNode.props;
	}

	getChatCommandStore() {
		const node = this.reactUtils.findReactParents(
			this.reactUtils.getReactInstance(document.querySelector(".stream-chat")),
			(n) => n.pendingProps?.value?.getCommands != null,
			25,
		);
		return node?.pendingProps.value;
	}

	getChat(): Chat {
		const node = this.reactUtils.findReactChildren(
			this.reactUtils.getReactInstance(document.querySelector(".stream-chat")),
			(n) => n.stateNode?.props?.onSendMessage,
			1000,
		);
		return <Chat>node?.stateNode;
	}

	getChatController() {
		const node = this.reactUtils.findReactParents<ChatControllerComponent>(
			this.reactUtils.getReactInstance(
				document.querySelector('section[data-test-selector="chat-room-component-layout"]'),
			),
			(n) => n.stateNode?.props?.chatConnectionAPI,
			50,
		);
		return node?.stateNode;
	}

	addCommandToChat(command: Command) {
		this.getChatCommandStore().addCommand(command);
	}

	getChatInputContent(): string | null {
		const chatInputElement = document.querySelector(
			'span[data-a-target="chat-input-text"]',
		) as HTMLTextAreaElement | null;

		if (chatInputElement) {
			return chatInputElement.textContent;
		}
		return null;
	}

	getChatInput() {
		return this.reactUtils.findReactChildren(
			this.reactUtils.getReactInstance(document.querySelector(".chat-input")),
			(n) => n.stateNode?.state?.value,
			1000,
		);
	}

	getChannelId(): string {
		return this.reactUtils.findReactChildren(
			this.reactUtils.getReactInstance(document.querySelector(".channel-info-content")),
			(n) => n.stateNode?.props?.channelID,
			1000,
		)?.pendingProps.channelID;
	}

	setChatMessage(message: string) {
		const chatInput = this.getChatInput() as ChatInput;
		chatInput.stateNode.state.value = `/playsound ${message}`;
		chatInput.stateNode.forceUpdate();
	}

	getChatMessage(message: Node) {
		const instance = this.reactUtils.getReactInstance(message)?.return?.stateNode as TwitchChatMessageComponent;
		return instance?.props.message ? instance : undefined;
	}

	getScrollableChat() {
		const element = document.querySelector(".chat-scrollable-area__message-container");

		const node = this.reactUtils.findReactParents<ScrollableChatComponent>(
			this.reactUtils.getReactInstance(element),
			(n) => n.stateNode?.onScroll,
		);

		return {
			component: node?.stateNode,
			element,
		};
	}

	unstuckScroll() {
		const nativeChat = this.getScrollableChat();
		const sevenTvChat = document.querySelector(".scrollable-contents");
		if (!nativeChat && !sevenTvChat) return;
		if (
			nativeChat.element?.classList.contains("chat-scrollable-area__message-container--paused") ||
			sevenTvChat?.querySelector(".seventv-message-buffer-notice")?.textContent === "Chat Paused"
		)
			return;
		if (sevenTvChat) {
			sevenTvChat.scrollTop = sevenTvChat.scrollHeight;
		} else if (nativeChat) {
			nativeChat.component?.scrollToBottom();
		}
	}

	getChatInfo() {
		return this.reactUtils.findReactChildren<ChatInfo>(
			this.reactUtils.getReactInstance(document.querySelector(".chat-list--default")),
			(n) => n.stateNode?.props?.sharedChatDataByChannelID,
			10000,
		);
	}
}
