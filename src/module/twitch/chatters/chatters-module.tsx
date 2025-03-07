import { type Signal, signal } from "@preact/signals";
import Module from "module/core/module.ts";
import { render } from "preact";
import styled from "styled-components";
import type { ModuleConfig } from "types/module/module.types.ts";

export default class ChattersModule extends Module {
	private static URL_CONFIG = (url: string) => {
		return !url.includes("clips.twitch.tv");
	};

	config: ModuleConfig = {
		name: "chatters",
		appliers: [
			{
				type: "selector",
				selectors: ['p[data-a-target="animated-channel-viewers-count"]'],
				callback: this.run.bind(this),
				key: "chatters",
				validateUrl: ChattersModule.URL_CONFIG,
				useParent: true,
				once: true,
			},
			{
				type: "selector",
				selectors: [
					'div[data-a-target="channel-viewers-count"]',
					'p[data-test-selector="stream-info-card-component__description"]',
				],
				callback: this.run.bind(this),
				key: "chatters",
				validateUrl: ChattersModule.URL_CONFIG,
				once: true,
			},
		],
	};

	private chattersCounter = {} as Signal<number>;

	private run(elements: Element[]) {
		this.logger.info(this.getId(), "creating elements...");
		const wrappers = this.utilsRepository.commonUtils.createEmptyElements(
			this.getId(),
			elements,
			"span",
		);
		this.createChattersCounter();
		wrappers.forEach((element) => {
			render(
				<ChattersComponent
					click={this.updateChatters.bind(this)}
					counter={this.chattersCounter}
				/>,
				element,
			);
		});
	}

	private updateChatters() {
		this.chattersCounter.value = Math.random() * 10;
	}

	private createChattersCounter() {
		if ("value" in this.chattersCounter) return;
		this.chattersCounter = signal<number>(-1);
	}
}

interface ChattersComponentProps {
	counter: Signal<number>;
	click: () => void;
}

const Wrapper = styled.span`
	margin-left: 4px;
	color: #ff8280;
	font-weight: 600 !important;

	&:hover {
		opacity: 0.75;
		cursor: pointer;
	}
`;

function ChattersComponent({ click, counter }: ChattersComponentProps) {
	return (
		<Wrapper onClick={click}>
			({counter.value === -1 ? "Loading..." : counter.value})
		</Wrapper>
	);
}
