import { type Setter, createSignal } from "solid-js";
import { render } from "solid-js/web";
import type Logger from "../../../logger/logger.ts";
import { CHATTERS_QUERY } from "../../../util/twitch-gql/queries.ts";
import type { ChattersResponse } from "../../../util/twitch-gql/types.ts";
import type TwitchUtil from "../../../util/twitch.util.ts";
import TwitchModule from "../twitch-module.ts";
import { ChattersComponent } from "./chatters.component.tsx";

export default class ChattersModule extends TwitchModule {
	private chattersUpdater: Timer | undefined;
	private currentChannel: string | undefined;

	private parent: Element | undefined;

	constructor(logger: Logger, utils: TwitchUtil) {
		super("chatters", { type: "timer", platform: "twitch" }, logger, utils);
	}

	async canRun(): Promise<boolean> {
		this.parent = this.utils.getElementParent(
			'p[data-a-target="animated-channel-viewers-count"]',
		);
		return (
			!!this.parent && !this.utils.elementAlreadyExists(this.getElementId())
		);
	}

	async run() {
		const element = this.prepare();
		const [count, setCount] = createSignal(-1);

		await this.updater(setCount);
		this.chattersUpdater = setInterval(
			async () => await this.updater(setCount),
			60000,
		);

		render(() => <ChattersComponent count={count()} />, element);
	}

	async updater(setCount: Setter<number>) {
		try {
			const { data } = await this.utils.gql<ChattersResponse>(CHATTERS_QUERY, {
				name: "h2p_gucio",
			});
			setCount(data.channel.chatters.count);
		} catch (error) {
			this.logger.warn("Could not fetch chatters count", error);
		}
	}

	prepare() {
		if (!this.parent)
			throw new Error("Cannot create component for undefined parent");
		if (this.chattersUpdater) clearInterval(this.chattersUpdater);
		this.utils.removeElement(this.getElementId());
		return this.utils.createElementByParent(
			this.getRawElementId(),
			"div",
			this.parent,
		);
	}
}
