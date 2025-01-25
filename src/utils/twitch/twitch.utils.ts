import type { GQLResponse } from "types/utils/react";
import type {
	ChatControllerComponent,
	FollowedSection,
	MediaPlayerComponent,
	PersistentPlayerComponent,
	TwitchChatMessageComponent,
	UserID,
} from "types/utils/twitch-react";
import type ReactUtils from "utils/react/react.utils.ts";

export default class TwitchUtils {
	constructor(private readonly reactUtils: ReactUtils) {}

	private readonly TWITCH_GQL_ENDPOINT = "https://gql.twitch.tv/gql";
	private readonly TWITCH_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";

	async gql<T>(query: string, variables: Record<string, string>) {
		return new Promise<GQLResponse<T>>((resolve, reject) =>
			fetch(this.TWITCH_GQL_ENDPOINT, {
				method: "POST",
				headers: {
					"Client-ID": this.TWITCH_CLIENT_ID,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query, variables }),
			})
				.then((response) => response.json())
				.then((response) => resolve(response))
				.catch((error) => reject(error)),
		);
	}

	getCurrentChannelByUrl() {
		let url = window.location.href;
		url = url.replace(/(^\w+:|^)\/\//, "");
		const elements = url.split("/");
		let name = elements[1];
		if (name === "popout" || elements[0].includes("dashboard"))
			name = elements[2];
		if (name.includes("?")) name = name.substring(0, name.indexOf("?"));
		return name.toLowerCase();
	}

	getUserIdBySideElement(element: Element): UserID | undefined {
		return this.reactUtils.findReactChildren<number>(
			this.reactUtils.getReactInstance(element),
			(n) => !!n.pendingProps?.userID,
			20,
		)?.pendingProps?.userID;
	}

	getMediaPlayerInstance() {
		return this.reactUtils.findReactChildren<MediaPlayerComponent>(
			this.reactUtils.getReactInstance(
				document.querySelector(".persistent-player"),
			),
			(n) => !!n.stateNode?.props?.mediaPlayerInstance,
			20,
		)?.stateNode.props.mediaPlayerInstance;
	}

	getPersonalSections() {
		return this.reactUtils.findReactParents<FollowedSection>(
			this.reactUtils.getReactInstance(
				document.querySelector(".side-nav-section"),
			),
			(n) => !!n.stateNode?.props?.section,
			1000,
		)?.stateNode;
	}

	getPersistentPlayer() {
		return this.reactUtils.findReactChildren<PersistentPlayerComponent>(
			this.reactUtils.getReactInstance(
				document.querySelector(".persistent-player"),
			),
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

	getChatController() {
		const node = this.reactUtils.findReactParents<ChatControllerComponent>(
			this.reactUtils.getReactInstance(
				document.querySelector(
					'section[data-test-selector="chat-room-component-layout"]',
				),
			),
			(n) => n.stateNode?.props?.chatConnectionAPI,
			50,
		);
		return node?.stateNode;
	}

	sendSimpleMessage(message: string) {
		const chatController = this.getChatController();
		if (!chatController) return;
		const id = Date.now();
		chatController.pushMessage({
			id,
			msgid: id,
			type: 28,
			message,
			channel: `#${chatController.props.channelLogin}`,
		});
	}

	getChatMessage(message: Node) {
		const instance = this.reactUtils.getReactInstance(message)?.return
			?.stateNode as TwitchChatMessageComponent;
		return instance?.props.message ? instance : undefined;
	}

	private generateChatMessage() {
		const uuid = crypto.randomUUID();
		this.sendSimpleMessage(uuid);
		return uuid;
	}
}
