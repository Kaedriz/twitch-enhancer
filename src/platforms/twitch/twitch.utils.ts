import type ReactUtils from "$shared/utils/react.utils.ts";
import type {
	ChannelInfoComponent,
	Chat,
	ChatControllerComponent,
	ChatInfoComponent,
	ChatInput,
	Command,
	CurrentLiveStatusComponent,
	FollowedSection,
	MediaPlayerComponent,
	PersistentPlayerComponent,
	ScrollableChatComponent,
	TwitchChatMessageComponent,
} from "$types/platforms/twitch/twitch.utils.types";

export default class TwitchUtils {
	constructor(protected readonly reactUtils: ReactUtils) {}

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
			200,
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

	getChat() {
		const node = this.reactUtils.findReactChildren<Chat>(
			this.reactUtils.getReactInstance(document.querySelector(".stream-chat")),
			(n) => n.stateNode?.props?.onSendMessage,
			1000,
		);
		return node?.stateNode;
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
		this.getChatCommandStore().addCommand({ ...command, group: "Enhancer" });
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

	/*getChatInput() {
		return this.reactUtils.findReactChildren(
			this.reactUtils.getReactInstance(document.querySelector(".chat-input")),
			(n) => n.stateNode?.state?.value,
			1000,
		);
	}*/

	getChannelId(): string {
		return this.reactUtils.findReactChildren(
			this.reactUtils.getReactInstance(document.querySelector(".channel-info-content")),
			(n) => n.stateNode?.props?.channelID,
			1000,
		)?.pendingProps.channelID;
	}

	/*setChatMessage(message: string) {
		const chatInput = this.getChatInput() as ChatInput;
		chatInput.stateNode.state.value = `/playsound ${message}`;
		chatInput.stateNode.forceUpdate();
	}*/

	getChatMessage(message: Node) {
		const instance = this.reactUtils.getReactInstance(message)?.return?.stateNode as TwitchChatMessageComponent;
		return instance?.props.message ? instance : undefined;
	}

	getAutoCompleteHandler() {
		return this.reactUtils.findReactChildren<ChatInput>(
			this.reactUtils.getReactInstance(document.querySelector(".chat-input__textarea")),
			(n) => n.stateNode?.providers,
			1000,
		)?.stateNode;
	}

	setChatText(message: string, focus: boolean) {
		const chatInput = this.getAutoCompleteHandler();
		chatInput?.componentRef.props.onChange({ target: { value: message } });
		if (focus) chatInput?.componentRef.focus();
	}

	addTextToChatInput(message: string) {
		const value = this.getAutoCompleteHandler()?.state.value || "";
		this.setChatText(this.format(message, value), true);
	}

	format(text: string, value: string): string {
		const formattedText = !value.endsWith(" ") && value.length > 0 ? ` ${text}` : text;
		return `${value}${formattedText}`;
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

	getVideoIdFromLink(link: string) {
		if (!URL.canParse(link)) return;
		const params = link.split("/");
		const videoIndex = params.findIndex((item) => item === "videos" || item === "video");
		if (videoIndex === -1) return;
		let id = params[videoIndex + 1];
		if (id.includes("?")) id = id.substring(0, id.lastIndexOf("?"));
		return id;
	}

	getChatInfo() {
		return this.reactUtils.findReactChildren<ChatInfoComponent>(
			this.reactUtils.getReactInstance(document.querySelector(".chat-list--default")),
			(n) => n.stateNode?.props?.sharedChatDataByChannelID,
			100,
		)?.stateNode;
	}

	getCurrentLiveStatus() {
		return this.reactUtils.findReactChildren<CurrentLiveStatusComponent>(
			this.reactUtils.getReactInstance(document.querySelector(".video-player__default-player")),
			(n) =>
				n?.stateNode?.props.isOffline !== undefined &&
				n?.stateNode?.props.isPlaying !== undefined &&
				n?.stateNode?.props.liveContentChannelLogin,
			100,
		)?.stateNode.props;
	}

	getChannelInfo() {
		return this.reactUtils.findReactChildren<ChannelInfoComponent>(
			this.reactUtils.getReactInstance(document.querySelector("#live-channel-stream-information")),
			(n) => n?.stateNode?.props.channelLogin !== undefined && n?.stateNode?.props.channelName !== undefined,
			100,
		)?.stateNode.props;
	}
}
