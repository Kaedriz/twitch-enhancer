import type { QuickAccessLink } from "$types/shared/components/settings.component.types.ts";
import type { TwitchModuleConfig } from "$types/shared/module/module.types.ts";
import { type Signal, signal } from "@preact/signals";
import { render } from "preact";
import styled from "styled-components";
import TwitchModule from "../../twitch.module.ts";

export default class ChannelSectionModule extends TwitchModule {
	private quickAccessLinks = {} as Signal<QuickAccessLink[]>;
	private watchtimeCounter = {} as Signal<number>;
	private currentChannelName: string | undefined;
	private watchtimeInterval: NodeJS.Timeout | undefined;

	readonly config: TwitchModuleConfig = {
		name: "channel-info",
		appliers: [
			{
				type: "selector",
				key: "channel-info",
				selectors: [".about-section__panel"],
				callback: this.run.bind(this),
				once: true,
			},
			{
				type: "event",
				key: "settings-quick-access-links",
				event: "twitch:settings:quickAccessLinks",
				callback: (quickAccessLinks) => {
					this.quickAccessLinks.value = quickAccessLinks;
				},
			},
		],
	};

	async initialize() {
		const quickAccessLinks = await this.settingsService().getSettingsKey("quickAccessLinks");
		this.quickAccessLinks = signal(quickAccessLinks);
	}

	private async run(elements: Element[]) {
		const wrappers = this.commonUtils().createEmptyElements(this.getId(), elements, "div");
		for (const wrapper of wrappers) {
			const channelName = this.twitchUtils().getCurrentChannelByUrl();
			this.currentChannelName = channelName;
			if (!channelName) {
				this.logger.warn("Error: Channel name not found");
				continue;
			}
			await this.startWatchtimeUpdates();
			const logo = await this.commonUtils().getIcon(
				this.workerService(),
				"enhancer/logo.svg",
				"https://enhancer.at/assets/brand/logo.png",
			);
			render(
				<ChannelInfoComponent
					channelName={channelName}
					sites={this.quickAccessLinks}
					watchTime={this.watchtimeCounter}
					logoUrl={logo}
				/>,
				wrapper,
			);
		}
	}

	private async updateWatchtime() {
		if (!this.currentChannelName) return;
		try {
			this.watchtimeCounter.value = await this.getWatchTime(this.currentChannelName);
		} catch (error) {
			console.error("Failed to fetch watch time:", error);
		}
	}

	public async startWatchtimeUpdates() {
		if (!("value" in this.watchtimeCounter)) {
			this.watchtimeCounter = signal(0);
		}
		if (this.watchtimeInterval) {
			clearInterval(this.watchtimeInterval);
		}
		await this.updateWatchtime();
		this.watchtimeInterval = setInterval(async () => {
			await this.updateWatchtime();
		}, 1000);
	}

	private async getWatchTime(channelName: string): Promise<number> {
		const watchtime = await this.workerService().send("getWatchtime", {
			platform: "twitch",
			channel: channelName.toLowerCase(),
		});
		return watchtime?.time ?? 0;
	}
}

interface ChannelInfoComponentProps {
	channelName: string;
	sites: Signal<QuickAccessLink[]>;
	watchTime: Signal<number>;
	logoUrl: string;
}

function ChannelInfoComponent({ channelName, sites, watchTime, logoUrl }: ChannelInfoComponentProps) {
	const formatWatchTime = (time: number) => {
		const hours = time === 0 ? 0 : time / 3600;
		if (hours < 1) return `${Math.round(hours * 60)} minutes`;
		if (hours < 10) return `${hours.toFixed(1)} hours`;
		return `${Math.round(hours)} hours`;
	};

	return (
		<Container>
			<Header>
				<ChannelInfo>
					<LogoContainer>
						<img src={logoUrl} alt={"Enhancer Logo"} />
					</LogoContainer>
					<ChannelDetails
						onClick={() => {
							console.info("Enhancer", watchTime.value);
						}}
					>
						<ChannelNameRow>
							<ChannelName>{channelName}</ChannelName>
							<RowText>—</RowText>
							<RowText>You've watched this channel for {formatWatchTime(watchTime.value)}</RowText>
						</ChannelNameRow>
					</ChannelDetails>
				</ChannelInfo>
			</Header>
			<Content>
				<LinkGrid>
					{sites.value.map((site) => {
						const fullUrl = site.url.replace("%username%", channelName);
						return (
							<LinkItem key={site.title} href={fullUrl} target="_blank" rel="noopener noreferrer">
								<LinkName>{site.title}</LinkName>
							</LinkItem>
						);
					})}
				</LinkGrid>
			</Content>
		</Container>
	);
}

const Container = styled.div`
	background: rgba(25, 25, 28, 0.95);
	border-radius: 8px;
	overflow: hidden;
	margin: 16px 0;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.05);
	transition: all 0.2s ease;

	&:hover {
		border-color: rgba(145, 71, 255, 0.3);
		box-shadow: 0 4px 16px rgba(145, 71, 255, 0.15);
	}
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	background: rgba(30, 30, 40, 0.6);
`;

const ChannelInfo = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
`;

const LogoContainer = styled.div`
	margin-right: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
`;

const ChannelDetails = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;

const ChannelNameRow = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

const ChannelName = styled.div`
	font-weight: 600;
	color: #ffffff;
	font-size: 14px;
`;

const RowText = styled.div`
	color: #b8b8b8;
	font-size: 12px;
	display: flex;
	align-items: center;
`;

const Content = styled.div`
	padding: 12px 16px;
`;

const LinkGrid = styled.div`
	display: flex;
	gap: 8px;
`;

const LinkItem = styled.a`
	display: flex;
	align-items: center;
	padding: 8px 12px;
	background: rgba(40, 40, 50, 0.6);
	border-radius: 6px;
	color: #e0e0e0;
	text-decoration: none;
	transition: all 0.2s;

	&:hover {
		background: rgba(145, 71, 255, 0.2);
		color: white;
		transform: translateY(-2px);
		text-decoration: none;
	}
`;

const LinkName = styled.div`
	font-size: 13px;
	font-weight: 500;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;
