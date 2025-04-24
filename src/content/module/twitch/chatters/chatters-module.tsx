import { type Signal, signal } from "@preact/signals";
import { render } from "preact";
import styled from "styled-components";
import type { ChattersResponse } from "types/content/api/twitch-api.types.ts";
import type { ModuleConfig } from "types/content/module/module.types.ts";
import { ChattersQuery } from "../../../api/twitch/twitch-queries.ts";
import Module from "../../module.ts";

export default class ChattersModule extends Module {
	private static URL_CONFIG = (url: string) => !url.includes("clips.twitch.tv");

	config: ModuleConfig = {
		name: "chatters",
		appliers: [
			{
				type: "selector",
				selectors: ['p[data-a-target="animated-channel-viewers-count"]'],
				callback: this.createTotalChattersComponent.bind(this),
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
				callback: this.createTotalChattersComponent.bind(this),
				key: "chatters",
				validateUrl: ChattersModule.URL_CONFIG,
				once: true,
			},
			{
				type: "selector",
				selectors: [".ReactModal__Content .tw-balloon"],
				callback: this.createIndividualChattersComponents.bind(this),
				key: "shared-chatters",
				validateUrl: ChattersModule.URL_CONFIG,
				useParent: true,
				once: true,
			},
		],
	};

	private totalChattersCounter = signal(-1);
	private chattersCounters: Record<string, Signal<number>> = {};

	private updateInterval: NodeJS.Timeout | undefined;
	private lastUpdatedAt = 0;

	private static INDIVIDUAL_CHATTERS_COMPONENT_WRAPPER_CLASS = "enhancer-chat-counter-wrapper";
	private static UPDATE_INTERVAL_TIME = 30000;

	private findUsernameFromStatusIndicator(el?: Element | null): string | null {
		const container = el?.parentElement?.parentElement?.parentElement;
		return container?.querySelector("p")?.textContent ?? null;
	}

	private createTotalChattersComponent(elements: Element[]) {
		const wrappers = this.commonUtils().createEmptyElements(this.getId(), elements, "span");

		this.requestUpdate();
		if (this.updateInterval) clearInterval(this.updateInterval);
		this.updateInterval = setInterval(() => this.requestUpdate(), ChattersModule.UPDATE_INTERVAL_TIME);

		wrappers.forEach((element) => {
			render(
				<ChattersComponent click={this.refreshChatters.bind(this)} counter={this.totalChattersCounter} />,
				element,
			);
		});
	}

	private createIndividualChattersComponents(elements: Element[]) {
		elements.forEach((root) => {
			const indicators = root.querySelectorAll(".tw-channel-status-indicator");

			indicators.forEach((indicator) => {
				const username = this.findUsernameFromStatusIndicator(indicator)?.toLowerCase();
				if (!username) return;

				const counter = this.getOrCreateCounter(username, -1);
				if (counter !== undefined && indicator.parentElement) {
					let existing = indicator.parentElement.querySelector(
						`.${ChattersModule.INDIVIDUAL_CHATTERS_COMPONENT_WRAPPER_CLASS}`,
					);
					if (!existing) {
						existing = document.createElement("span");
						existing.className = ChattersModule.INDIVIDUAL_CHATTERS_COMPONENT_WRAPPER_CLASS;
						indicator.parentElement.appendChild(existing);
					}
					render(<ChattersComponent click={this.refreshChatters.bind(this)} counter={counter} />, existing);
				}
			});
		});
	}

	private async refreshChatters(loginsToUpdate: string[] = []) {
		const chatInfo = this.twitchUtils().getChatInfo()?.props;
		if (!chatInfo) return;

		const sharedLogins = Array.from(chatInfo.sharedChatDataByChannelID.values()).map((userInfo) =>
			userInfo.login.toLowerCase(),
		);
const uniqueLogins = [...new Set([chatInfo.channelLogin.toLowerCase(), ...sharedLogins])];
if (uniqueLogins.length === 0) return;
		for (const login of uniqueLogins) {
			if (loginsToUpdate.length > 0 && !loginsToUpdate.includes(login)) continue;

			try {
				const { data } = await this.twitchApi().gql<ChattersResponse>(ChattersQuery, {
					name: login,
				});
				const counter = this.getOrCreateCounter(login, data.channel.chatters.count);
				counter.value = data.channel.chatters.count;
			} catch (error) {
				this.logger.warn(`Failed to fetch chatters for ${login}`, error);
			}
		}

		for (const activeLogin of Object.keys(this.chattersCounters)) {
			if (!uniqueLogins.includes(activeLogin)) {
				delete this.chattersCounters[activeLogin];
			}
		}

		this.updateTotalChattersCounter();
		this.lastUpdatedAt = Date.now();
	}

	private updateTotalChattersCounter() {
		const chatterSignals = Object.values(this.chattersCounters);
		if (chatterSignals.length === 0) return -1;
		this.totalChattersCounter.value = chatterSignals.reduce((sum, chatterSignal) => {
			return sum + chatterSignal.value;
		}, 0);
	}

	private getOrCreateCounter(login: string, value: number) {
		let counter = this.chattersCounters[login];
		if (!counter) {
			counter = signal(value);
			this.chattersCounters[login] = counter;
		}
		return counter;
	}

	private async requestUpdate() {
		if (this.lastUpdatedAt + ChattersModule.UPDATE_INTERVAL_TIME * 0.75 >= Date.now()) {
			await this.updateAllEmptyCounters();
			return;
		}
		await this.refreshChatters();
	}

	private async updateAllEmptyCounters() {
		const emptyLogins = Object.entries(this.chattersCounters)
			.filter(([login, counter]) => {
				return counter.value === -1;
			})
			.map(([login]) => {
				return login;
			});
		if (emptyLogins.length < 1) return;
		await this.refreshChatters(emptyLogins);
	}
}

const Wrapper = styled.span`
  margin-left: 4px;
  color: #ff8280;
  font-weight: 600 !important;
  white-space: nowrap;

  &:hover {
    opacity: 0.75;
    cursor: pointer;
  }
`;

const formatChatters = (chatters: number) => chatters.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const ChattersComponent = ({
	click,
	counter,
}: {
	counter: Signal<number>;
	click: () => void;
}) => <Wrapper onClick={click}>({counter.value === -1 ? "Loading..." : formatChatters(counter.value)})</Wrapper>;
