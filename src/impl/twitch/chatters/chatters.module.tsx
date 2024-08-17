import Module from "module/module.ts";
import type { ElementModuleEvent, ModuleConfig } from "module/types.ts";
import { type Accessor, type Setter, createSignal } from "solid-js";
import { render } from "solid-js/web";
import { ChattersComponent } from "./component/chatters.component.tsx";

export default class ChattersModule extends Module {
	private chattersUpdater: Timer | undefined;

	private counterInitialized = false;
	private count: Accessor<number> = {} as Accessor<number>;
	private setCount: Setter<number> = {} as Setter<number>;

	protected config(): ModuleConfig {
		//TODO Filter when on clips page
		return {
			name: "chatters",
			type: "element",
			elements: [
				{
					selector: 'p[data-a-target="animated-channel-viewers-count"]',
					useParent: true,
					once: true,
				},
				{
					selector: 'div[data-a-target="channel-viewers-count"]',
					once: true,
				},
				{
					selector:
						'p[data-test-selector="stream-info-card-component__description"]',
					once: true,
				},
			],
			platform: "twitch",
		};
	}

	protected async run(event: ElementModuleEvent) {
		const elements = this.utils.createEmptyElements(this.id(), event.elements);
		this.createCounter();
		await this.update(this.setCount);
		if (this.chattersUpdater) clearInterval(this.chattersUpdater);
		this.chattersUpdater = setInterval(
			async () => await this.update(this.setCount),
			5000,
		);
		elements.forEach((element) =>
			render(() => <ChattersComponent count={this.count()} />, element),
		);
	}

	private createCounter() {
		if (this.counterInitialized) return;
		this.counterInitialized = true;
		const [count, setCount] = createSignal(-1);
		this.count = count;
		this.setCount = setCount;
	}

	private async update(setCount: Setter<number>) {
		try {
			const channel = "h2p_gucio";
			// const { data } = await this.utils.twitch.gql<ChattersResponse>(
			// 	ChattersQuery,
			// 	{
			// 		name: channel,
			// 	},
			// );
			const chatters = Number.parseInt(String(Math.random() * 1000));
			this.logger.debug(
				`Refreshing chatters count on ${channel} to ${chatters}`,
			);
			setCount(chatters);
		} catch (error) {
			this.logger.warn("Could not fetch chatters count", error);
		}
	}
}
