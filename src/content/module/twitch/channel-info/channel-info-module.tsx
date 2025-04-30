import Module from "module/module.ts";
import { h, render } from "preact";
import styled from "styled-components";
import type { ModuleConfig } from "types/content/module/module.types.ts";

export default class ChannelInfoModule extends Module {
	config: ModuleConfig = {
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

	private sites: site[] = [
		{ name: "Sullygnome", redirectUrl: "https://sullygnome.com/channel/" },
		{ name: "TwitchTracker", redirectUrl: "https://twitchtracker.com/" },
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

			render(<ChatInfoComponent channelName={channelName} sites={this.sites} />, newElement);
		});
	}
}

type site = {
	name: string;
	redirectUrl: string;
};

interface ChatInfoComponentProps {
	sites: site[];
	channelName: string;
}

const InfoContainer = styled.div`
	background-color: #19191c;
	color: #ffffff;
	border-radius: 8px;
	padding: 10px 20px 20px 10px;
	margin: 16px 0;
	display: flex;
	align-items: center;
`;

const IconContainer = styled.div`
	display: flex;
	align-items: center;
	margin-top: 10px;
	margin-bottom: 10px;
	margin-left: 10px;
	height: 64px;
`;

const LinksContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-left: 20px;
	gap: 15px;
`;

const StyledLink = styled.a`
    color: white;
    text-decoration: none;
    font-size: 1.1em;
    font-weight: 600;

    &:hover {
        text-decoration: underline;
        color: #bf94ff;
    }

    &:focus {
        outline: 2px solid #a970ff;
        outline-offset: 2px;
        border-radius: 3px;
    }
`;

const ChatInfoComponent = ({ sites, channelName }: ChatInfoComponentProps) => {
	return (
		<InfoContainer>
			<IconContainer>
				<svg width="48" height="48" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
					<title>Enhancer logo</title>
					<path
						d="M73.2308 64C73.2308 69.098 69.098 73.2308 64 73.2308C58.902 73.2308 54.7692 69.098 54.7692 64C54.7692 58.902 58.902 54.7692 64 54.7692C69.098 54.7692 73.2308 58.902 73.2308 64Z"
						fill="#9147FF"
					/>
					<path
						d="M85.5385 97.2069V104H104V85.5385H96.9427C93.9804 90.1653 90.0918 94.142 85.5385 97.2069Z"
						fill="#9147FF"
					/>
					<path
						d="M64 91.6923C48.706 91.6923 36.3077 79.294 36.3077 64C36.3077 48.706 48.706 36.3077 64 36.3077C79.294 36.3077 91.6923 48.706 91.6923 64H104C104 41.9086 86.0914 24 64 24C41.9086 24 24 41.9086 24 64C24 86.0914 41.9086 104 64 104V91.6923Z"
						fill="#9147FF"
					/>
					<path d="M64 91.6923H76.3077V104H64V91.6923Z" fill="#9147FF" />
					<path d="M91.6923 64H104V76.3077H91.6923V64Z" fill="#9147FF" />
				</svg>
			</IconContainer>

			<LinksContainer>
				{sites.map((site) => {
					const fullUrl = `${site.redirectUrl}${channelName}`;

					return (
						<StyledLink key={site.name} href={fullUrl} target="_blank" rel="noopener noreferrer">
							{site.name}
						</StyledLink>
					);
				})}
			</LinksContainer>
		</InfoContainer>
	);
};
