import type {
	ChatControllerComponent,
	PersistentPlayerComponent,
	ReactComponent,
	TwitchChatMessageComponent,
} from "utils/twitch/react/types.ts";

export default class ReactUtils {
	findReactParents<T>(
		node: any,
		predicate: (node: any) => boolean,
		maxDepth = 15,
		depth = 0,
	): ReactComponent<T> | null {
		let success = false;
		try {
			success = predicate(node);
		} catch (_) {}
		if (success) return node;
		if (!node || depth > maxDepth) return null;

		const { return: parent } = node;
		if (parent) {
			return this.findReactParents(parent, predicate, maxDepth, depth + 1);
		}

		return null;
	}

	findReactChildren<T>(
		node: any,
		predicate: (node: any) => boolean,
		maxDepth = 15,
		depth = 0,
	): ReactComponent<T> | null {
		let success = false;
		try {
			success = predicate(node);
		} catch (_) {}
		if (success) return node;
		if (!node || depth > maxDepth) return null;

		const { child, sibling } = node;
		if (child || sibling) {
			return (
				this.findReactChildren(child, predicate, maxDepth, depth + 1) ||
				this.findReactChildren(sibling, predicate, maxDepth, depth + 1)
			);
		}

		return null;
	}

	getReactInstance(element: Element | Node | null) {
		for (const k in element) {
			if (
				k.startsWith("__reactFiber$") ||
				k.startsWith("__reactInternalInstance$")
			) {
				return (element as any)[k];
			}
		}
	}

	getPersistentPlayer() {
		return this.findReactChildren<PersistentPlayerComponent>(
			this.getReactInstance(document.querySelector(".persistent-player")),
			(n) => !!n.stateNode?.props?.content.channelLogin,
		)?.stateNode.props;
	}

	getChatCommandStore() {
		const node = this.findReactParents(
			this.getReactInstance(document.querySelector(".stream-chat")),
			(n) => n.pendingProps?.value?.getCommands != null,
			25,
		);
		return node?.pendingProps.value;
	}

	getChatController() {
		const node = this.findReactParents<ChatControllerComponent>(
			this.getReactInstance(
				document.querySelector(
					'section[data-test-selector="chat-room-component-layout"]',
				),
			),
			(n) => n.stateNode?.props?.chatConnectionAPI,
			25,
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
		const instance = this.getReactInstance(message)?.return
			?.stateNode as TwitchChatMessageComponent;
		return instance?.props.message ? instance : undefined;
	}

	private generateChatMessage() {
		const uuid = crypto.randomUUID();
		this.sendSimpleMessage(uuid);
		return uuid;
	}
}
