import Module from "module/module.ts";
import type { ElementModuleEvent, ModuleConfig } from "module/types.ts";
import { type Accessor, type Setter, createSignal } from "solid-js";
import { render } from "solid-js/web";
import {
	ChattersQuery,
	type ChattersResponse,
} from "utils/twitch/gql/chatters.ts";
import { ChattersComponent } from "./component/chatters.component.tsx";

export default class ChattersModule extends Module {
	private chattersUpdater: Timer | undefined;

	private counterInitialized = false;
	private count: Accessor<number> = {} as Accessor<number>;
	private setCount: Setter<number> = {} as Setter<number>;

	protected config(): ModuleConfig {
		const urlConfig = this.utils.createSimpleUrlConfig("exclude", [
			"clips.twitch.tv",
		]);
		return {
			name: "chatters",
			type: "element",
			elements: [
				{
					selector: 'p[data-a-target="animated-channel-viewers-count"]',
					useParent: true,
					once: true,
					urlConfig,
				},
				{
					selector: 'div[data-a-target="channel-viewers-count"]',
					once: true,
					urlConfig,
				},
				{
					selector:
						'p[data-test-selector="stream-info-card-component__description"]',
					once: true,
					urlConfig,
				},
			],
			platform: "twitch",
		};
	}

	protected async run(event: ElementModuleEvent) {
		const elements = this.utils.createEmptyElements(
			this.id(),
			event.elements,
			"span",
		);
		this.createCounter();
		await this.update();
		if (this.chattersUpdater) clearInterval(this.chattersUpdater);
		this.chattersUpdater = setInterval(async () => await this.update(), 60000);
		elements.forEach((element) =>
			render(
				() => (
					<ChattersComponent count={this.count()} click={() => this.update()} />
				),
				element,
			),
		);
	}

	private createCounter() {
		if (this.counterInitialized) return;
		this.counterInitialized = true;
		const [count, setCount] = createSignal(-1);
		this.count = count;
		this.setCount = setCount;
	}

	private async update() {
		try {
			const channel =
				this.utils.twitch
					.getPersistentPlayer()
					?.content.channelLogin?.toLowerCase() ??
				this.utils.twitch.getCurrentChannelByUrl();
			if (!channel)
				throw new Error(
					"Cannot request chatters, because channel is undefined",
				);
			const { data } = await this.utils.twitch.gql<ChattersResponse>(
				ChattersQuery,
				{
					name: channel,
				},
			);
			const chatters = data.channel.chatters.count;
			this.logger.debug(
				`Refreshing chatters count on ${channel} to ${chatters}`,
			);
			this.setCount(chatters);
		} catch (error) {
			this.logger.warn("Could not fetch chatters count", error);
		}
	}
}
