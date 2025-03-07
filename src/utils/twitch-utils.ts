import type Logger from "logger";
import type {
	ChatControllerComponent,
	FollowedSection,
	MediaPlayerComponent,
	PersistentPlayerComponent,
} from "types/utils/twitch-utils.types.ts";
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
		if (name === "popout" || elements[0].includes("dashboard"))
			name = elements[2];
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
}
