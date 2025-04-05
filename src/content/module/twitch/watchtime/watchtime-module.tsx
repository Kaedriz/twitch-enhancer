import Module from "module/module.ts";
import { render } from "preact";
import styled from "styled-components";
import type { EnhancerStreamerWatchTimeData } from "types/content/api/enhancer-api.types.ts";
import type { ModuleConfig } from "types/content/module/module.types.ts";

export default class WatchTimeModule extends Module {
	static readonly TWITCHTV_CHAT_SELECTOR = ".chat-list--default";
	static readonly SEVENTV_CHAT_SELECTOR = "main.seventv-chat-list";

	config: ModuleConfig = {
		name: "watchtime",
		appliers: [
			{
				type: "selector",
				selectors: [".chat-scrollable-area__message-container"],
				callback: this.run.bind(this),
				key: "watchtime",
				once: true,
			},
		],
	};

	async init(): Promise<void> {
		this.utilsRepository.twitchUtils.addCommandToChat({
			name: "watchtime",
			description: "Display watch time",
			helpText: "Display watch time of the user",
			permissionLevel: 0,
			handler: (username) => {
				this.renderWatchTime(username, this.fetchWatchTimeByUserName(username));
			},
			commandArgs: [
				{
					name: "username",
					isRequired: true,
				},
			],
		});
	}

	private async run() {}

	private async fetchWatchTimeByUserName(username: string): Promise<EnhancerStreamerWatchTimeData[]> {
		return await this.apiRepository.enhancerApi.getUserWatchTime(username);
	}

	private async renderWatchTime(username: string, promise: Promise<EnhancerStreamerWatchTimeData[]>) {
		const data = await promise;

		let contentElement: Element | null = null;

		if (document.querySelector(WatchTimeModule.SEVENTV_CHAT_SELECTOR)) {
			contentElement = document.querySelector(WatchTimeModule.SEVENTV_CHAT_SELECTOR);
		} else if (document.querySelector(WatchTimeModule.TWITCHTV_CHAT_SELECTOR)) {
			contentElement = document.querySelector(WatchTimeModule.TWITCHTV_CHAT_SELECTOR);
		}

		if (contentElement) {
			const wrapper = document.createElement("div");
			wrapper.classList.add("watchtime");
			contentElement.append(wrapper);

			const timeoutId = setTimeout(() => {
				wrapper.remove();
			}, 60000);

			render(
				<WatchTimeListComponent timeoutId={timeoutId} username={username} data={data} wrapper={wrapper} />,
				wrapper,
			);
		}
	}
}

interface UserWatchTimeProps {
	data: EnhancerStreamerWatchTimeData[];
	username: string;
	wrapper: HTMLElement;
	timeoutId: ReturnType<typeof setTimeout>;
}

const WatchTimeWrapper = styled.div`
	margin-bottom: 8px;
	background: #1e1e1e;
	padding: 10px;
	border-radius: 8px;
	color: white;
	font-size: 14px;
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const WatchTimeItem = styled.div`
	margin-left: 5px;
`;

const CloseButton = styled.button`
	cursor: pointer;
	background: transparent;
	border: none;
	color: white;
	font-size: 14px;
`;

function WatchTimeListComponent({ data, username, wrapper, timeoutId }: UserWatchTimeProps) {
	const removeWatchTime = () => {
		if (wrapper) {
			clearTimeout(timeoutId);
			wrapper.remove();
		}
	};

	if (!data || data.length === 0) {
		return (
			<WatchTimeWrapper>
				<Header>
					<strong>No data available for {username}:</strong>
					<CloseButton type="button" onClick={removeWatchTime}>
						X
					</CloseButton>
				</Header>
			</WatchTimeWrapper>
		);
	}

	const topFive = data.slice(0, 5);

	const formatWatchTime = (count: number): string => {
		const totalMinutes = count * 5;
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
	};

	return (
		<WatchTimeWrapper>
			<Header>
				<strong>Watchtime of {username}:</strong>
				<CloseButton type="button" onClick={removeWatchTime}>
					X
				</CloseButton>
			</Header>
			{topFive.map((item) => (
				<WatchTimeItem key={item.streamer}>
					{item.streamer} –{">"} {formatWatchTime(item.count)}
				</WatchTimeItem>
			))}
		</WatchTimeWrapper>
	);
}
