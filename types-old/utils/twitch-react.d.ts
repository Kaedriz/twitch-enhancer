import type { TwitchChatMessage } from "types/events/twitch/chat.events.d.ts";

export type ReactComponent<T> = {
	stateNode: T;
	pendingProps: any;
};

export type PersistentPlayerComponent = {
	props: { content: { type: "live"; channelLogin: string } };
};

export type ChatControllerMessage = {
	id: number;
	type: number;
	msgid: number;
	message: string;
	channel: string;
};

export type ChatControllerComponent = {
	pushMessage: (message: ChatControllerMessage) => void;
	props: {
		channelLogin: string;
		messageHandlerAPI: {
			addMessageHandler: (
				callback: (message: TwitchChatMessage) => void,
			) => void;
		};
	};
};

export interface TwitchChatMessageComponent {
	props: {
		channelLogin: string;
		channelID: string;
		message: {
			badges: Record<string, string>;
			id: string;
			message: string;
			user: {
				color: string;
				id: string;
				displayName: string;
				login: string;
			};
			nonce: string;
		};
	};
}

export type MediaPlayerComponent = {
	props: {
		mediaPlayerInstance: MediaPlayerInstance;
	};
};

export type PersonalSections = {
	props: {
		data: {
			personalSections: object[];
		};
	};
};

export type MediaPlayerInstance = {
	core: { state: { liveLatency: number; ingestLatency: number } };
	seekTo: (time: number) => void;
	getPosition(): number;
};

export type UserID = string;

export type FollowedSection = {
	props: {
		collapsed: boolean;
		section: {
			streams: StreamData[];
			videoConnections: StreamData[];
		};
		sort: {
			setSortType: (type: string) => void;
			type: string;
		};
	};
	forceUpdate: () => void;
};

export type Stream = {
	__typename: string;
	id: string;
	broadcaster: User;
	viewersCount: number;
	game: {
		__typename: string;
		id: string;
		slug: string;
		displayName: string;
		name: string;
	};
	type: string;
	hasHypeTrain: boolean;
};

export type User = {
	__typename: string;
	id: string;
	login: number;
	displayName: string;
	profileImageURL: string;
	primaryColorHex: string | null;
	broadcastSettings: {
		__typename: string;
		id: string;
		title: string;
	};
};

export type StreamData = {
	modelTrackingID: string;
	promotionsCampaignID: string;
	user: User;
	content: Stream;
	sectionType: string;
	channelLabel: string;
};
