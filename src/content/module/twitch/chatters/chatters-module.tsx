import { type Signal, signal } from "@preact/signals";
import { h, render } from "preact";
import styled from "styled-components";
import type { ChattersResponse } from "types/content/api/twitch-api.types.ts";
import type { ModuleConfig } from "types/content/module/module.types.ts";
import { ChattersQuery } from "../../../api/twitch/twitch-queries.ts";
import Module from "../../module.ts";

const Wrapper = styled.span`
  margin-left: 4px;
  color: #ff8280;
  font-weight: 600 !important;

  &:hover {
    opacity: 0.75;
    cursor: pointer;
  }
`;

const StyledWrapper = styled.div`
	position: relative;
	display: inline-block;
`;

type UserData = {
	login: string;
};

const formatChatters = (chatters: number) => chatters.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const ChatCount = ({ count }: { count: number }) => (
	<StyledWrapper>
		<Wrapper>({count === -1 ? "Loading..." : formatChatters(count)})</Wrapper>
	</StyledWrapper>
);

const ChattersComponent = ({
	click,
	counter,
}: {
	counter: Signal<number>;
	click: () => void;
}) => <Wrapper onClick={click}>({counter.value === -1 ? "Loading..." : formatChatters(counter.value)})</Wrapper>;

export default class ChattersModule extends Module {
	private static URL_CONFIG = (url: string) => !url.includes("clips.twitch.tv");

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
			{
				type: "selector",
				selectors: [".tw-balloon"],
				callback: this.multichatInit.bind(this),
				key: "multistream-chatters",
				validateUrl: ChattersModule.URL_CONFIG,
				useParent: true,
				once: true,
			},
		],
	};

	private chattersCounter = signal<number>(-1);
	private multiChattersCounter = signal(new Map<string, number>());
	private elements: Element[] = [];

	private multichatInit(elements: Element[]) {
		this.elements = elements;
	}

	private findUsernameFromStatusIndicator(el?: Element | null): string | null {
		const container = el?.parentElement?.parentElement?.parentElement;
		return container?.querySelector("p")?.textContent ?? null;
	}

	private updateMultiChatUI() {
		this.elements.forEach((root) => {
			const indicators = root.querySelectorAll(".tw-channel-status-indicator");

			indicators.forEach((indicator) => {
				const username = this.findUsernameFromStatusIndicator(indicator);
				if (!username) return;

				const count = this.multiChattersCounter.value.get(username.toLowerCase());
				if (count !== undefined && indicator.parentElement) {
					let existing = indicator.parentElement.querySelector(".chat-count-wrapper");
					if (!existing) {
						existing = document.createElement("span");
						existing.className = "chat-count-wrapper";
						indicator.parentElement.appendChild(existing);
					}
					render(<ChatCount count={count} />, existing);
				}
			});
		});
	}

	private async refreshChatters() {
		const users = this.twitchUtils().getChatInfo()?.pendingProps.sharedChatDataByChannelID;
		if (!users) return;

		const userArray = Array.from(users.values()) as UserData[];

		if (userArray.length === 0) {
			const defaultUser: UserData = {
				login:
					this.twitchUtils().getPersistentPlayer()?.content.channelLogin?.toLowerCase() ??
					this.twitchUtils().getCurrentChannelByUrl(),
			};
			userArray.push(defaultUser);
		}

		const entries = await Promise.all(
			userArray.map(async (user) => {
				try {
					const { data } = await this.twitchApi().gql<ChattersResponse>(ChattersQuery, {
						name: user.login.toLowerCase(),
					});
					return [user.login, data.channel.chatters.count] as [string, number];
				} catch (error) {
					return [user.login, 0] as [string, number];
				}
			}),
		);

		this.multiChattersCounter.value = new Map(entries);
		this.chattersCounter.value = this.getTotalChatters();
		this.updateMultiChatUI();
	}

	private run(elements: Element[]) {
		const wrappers = this.commonUtils().createEmptyElements(this.getId(), elements, "span");

		this.refreshChatters();
		setInterval(() => this.refreshChatters(), 30000);

		wrappers.forEach((element) => {
			render(<ChattersComponent click={this.refreshChatters.bind(this)} counter={this.chattersCounter} />, element);
		});
	}

	private getTotalChatters(): number {
		if (this.multiChattersCounter.value.size === 0) return -1;

		let sum = 0;
		this.multiChattersCounter.value.forEach((count) => {
			sum += count;
		});
		return sum;
	}
}
