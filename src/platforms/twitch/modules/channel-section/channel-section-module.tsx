import EnhancerIcon from "$shared/components/icon/enhancer-icon.tsx";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import type { ModuleConfig } from "$types/shared/module.types.ts";
import { render } from "preact";
import styled from "styled-components";
import TwitchModule from "../../twitch.module.ts";

export default class ChannelSectionModule extends TwitchModule {
	readonly config: ModuleConfig<TwitchEvents> = {
		name: "channel-info",
		appliers: [
			{
				type: "selector",
				key: "channel-info",
				selectors: [".about-section__panel"],
				callback: this.run.bind(this),
				once: true,
			},
		],
	};

	private defaultSites: Site[] = [
		{
			name: "Sullygnome",
			redirectUrl: "https://sullygnome.com/channel/",
		},
		{
			name: "TwitchTracker",
			redirectUrl: "https://twitchtracker.com/",
		},
	];

	private run(elements: Element[]) {
		elements.forEach((parentElement) => {
			const newElement = this.commonUtils().createElementByParent(this.getId(), "div", parentElement);
			newElement.id = this.getId();
			parentElement.appendChild(newElement);
			const channelName = this.twitchUtils().getCurrentChannelByUrl();
			if (!channelName) {
				this.logger.warn("Error: Channel name not found");
				return null;
			}
			const watchTime = this.getWatchTime(channelName);
			render(
				<ChannelInfoComponent channelName={channelName} sites={this.defaultSites} watchTime={watchTime} />,
				newElement,
			);
		});
	}

	private getWatchTime(channelName: string): number {
		// This is a placeholder - implement actual watch time tracking
		// You would likely get this from your extension's storage
		return 42.5; // Example: 42.5 hours
	}
}

type Site = {
	name: string;
	redirectUrl: string;
};

interface ChannelInfoComponentProps {
	channelName: string;
	sites: Site[];
	watchTime: number;
}

function ChannelInfoComponent({ channelName, sites, watchTime }: ChannelInfoComponentProps) {
	const formatWatchTime = (hours: number) => {
		if (hours < 1) return `${Math.round(hours * 60)} minutes`;
		if (hours < 10) return `${hours.toFixed(1)} hours`;
		return `${Math.round(hours)} hours`;
	};

	return (
		<Container>
			<Header>
				<ChannelInfo>
					<LogoContainer>
						<EnhancerIcon />
					</LogoContainer>
					<ChannelDetails>
						<ChannelNameRow>
							<ChannelName>{channelName}</ChannelName>
							<RowText>—</RowText>
							<RowText>You've watched this channel for {formatWatchTime(watchTime)}</RowText>
						</ChannelNameRow>
					</ChannelDetails>
				</ChannelInfo>
			</Header>

			<Content>
				<LinkGrid>
					{sites.map((site) => {
						const fullUrl = site.redirectUrl.endsWith("/")
							? `${site.redirectUrl}${channelName}`
							: `${site.redirectUrl}/${channelName}`;

						return (
							<LinkItem key={site.name} href={fullUrl} target="_blank" rel="noopener noreferrer">
								<LinkName>{site.name}</LinkName>
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
