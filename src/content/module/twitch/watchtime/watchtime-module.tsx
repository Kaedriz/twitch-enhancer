import Module from "module/module.ts";
import styled from "styled-components";
import type { EnhancerStreamerWatchTimeData } from "types/content/api/enhancer-api.types.ts";
import type { ModuleConfig } from "types/content/module/module.types.ts";

export default class WatchTimeModule extends Module {
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

	private isLoadingPopupVisible = false;

	private async run() {
		this.utilsRepository.twitchUtils.addCommandToChat({
			name: "watchtime",
			description: "See user's watchtime from xayo.pl service",
			helpText: "Missing username",
			permissionLevel: 0,
			handler: async (username) => {
				const name = username.startsWith("@") ? username.substring(1) : username;
				this.renderLoading(name);
				try {
					const data = await this.fetchWatchTimeByUserName(name.toLowerCase());
					this.renderWatchtime(name, data);
				} catch (error) {
					this.logger.error(`Failed to fetch watchtime for ${username}`, error);
					this.renderError(name);
				}
			},
			commandArgs: [
				{
					name: "username",
					isRequired: true,
				},
			],
		});
	}

	private async fetchWatchTimeByUserName(username: string): Promise<EnhancerStreamerWatchTimeData[]> {
		return await this.enhancerApi().getUserWatchTime(username);
	}

	private renderLoading(username: string) {
		this.isLoadingPopupVisible = true;
		this.eventEmitter.emit("twitch:chatPopupMessage", {
			title: `Fetching data for ${username}`,
			autoclose: 60,
			content: <WatchTimeLoadingContent />,
			onClose: () => this.handleLoadingPopupClose(),
		});
	}

	private renderWatchtime(username: string, data: EnhancerStreamerWatchTimeData[]) {
		if (!this.isLoadingPopupVisible) {
			return;
		}
		this.isLoadingPopupVisible = false;
		this.eventEmitter.emit("twitch:chatPopupMessage", {
			title: `Watchtime for ${username}`,
			autoclose: 15,
			content: <WatchTimeContent data={data} />,
		});
	}

	private renderError(username: string) {
		if (!this.isLoadingPopupVisible) {
			return;
		}
		this.isLoadingPopupVisible = false;
		this.eventEmitter.emit("twitch:chatPopupMessage", {
			title: `Failed to fetch watchtime for ${username}`,
			autoclose: 15,
			content: <WatchTimeErrorContent />,
		});
	}

	private handleLoadingPopupClose() {
		this.isLoadingPopupVisible = false;
	}
}

const LoadingSpinnerWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px 0;
`;

const LoadingSpinner = styled.div`
	width: 20px;
	height: 20px;
	border: 2px solid rgba(255, 255, 255, 0.1);
	border-top: 2px solid #bf94ff;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-bottom: 8px;

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
`;

const ContentText = styled.div`
	color: #8e8e8e;
	font-size: 13px;
`;

function WatchTimeLoadingContent() {
	return (
		<LoadingSpinnerWrapper>
			<LoadingSpinner />
			<ContentText>Fetching data from xayo.pl...</ContentText>
		</LoadingSpinnerWrapper>
	);
}

function WatchTimeErrorContent() {
	return <ContentText>An unexpected error occurred and we are sorry about that :( Please try again later.</ContentText>;
}

interface WatchTimeContentProps {
	data: EnhancerStreamerWatchTimeData[];
}

const WatchTimeList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

const WatchTimeItem = styled.div`
	display: flex;
	align-items: center;
`;

const Username = styled.span`
	color: #efeff1;
`;

const Arrow = styled.span`
	margin: 0 8px;
	color: #8e8e8e;
`;

const Time = styled.span`
	color: #bf94ff;
`;

const NoDataMessage = styled.div`
	color: #8e8e8e;
	text-align: center;
	padding: 10px 0;
`;

function WatchTimeContent({ data }: WatchTimeContentProps) {
	if (!data || data.length === 0) {
		return <NoDataMessage>No watchtime data available</NoDataMessage>;
	}

	const topFive = data.slice(0, 5);

	const formatWatchTime = (count: number): string => {
		const totalMinutes = count * 5;
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return `${hours}h ${minutes}m`;
	};

	return (
		<WatchTimeList>
			{topFive.map((item) => (
				<WatchTimeItem key={item.streamer}>
					<Username>{item.streamer}</Username>
					<Arrow>→</Arrow>
					<Time>{formatWatchTime(item.count)}</Time>
				</WatchTimeItem>
			))}
		</WatchTimeList>
	);
}
