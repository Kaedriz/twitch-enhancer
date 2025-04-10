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
		channelID: string;
		messageHandlerAPI: {
			addMessageHandler: (callback: (message: TwitchChatMessage) => void) => void;
		};
	};
};

export type TwitchChatMessage = {
	badges: Record<string, string>;
	id: string;
	nonce: string;
	user: TwitchChatMessageUser;
	isVip: boolean | undefined;
	isFirstMsg: boolean | undefined;
	isHistorical: boolean | undefined;
	message: string;
	timestamp: number;
	type: number;
	createdAt: number;
};

export type TwitchChatMessageUser = {
	userID: string;
	userDisplayName: string;
	userLogin: string;
	color: string;
	isSubscriber: boolean;
};

export type MediaPlayerComponent = {
	props: {
		mediaPlayerInstance: MediaPlayerInstance;
	};
};

export type MediaPlayerInstance = {
	core: { state: { liveLatency: number; ingestLatency: number } };
	seekTo: (time: number) => void;
	getPosition(): number;
};

export type FollowedSection = {
	props: {
		collapsed: boolean;
		section: {
			streams: FollowedSectionStreamData[];
			videoConnections: FollowedSectionStreamData[];
		};
		sort: {
			setSortType: (type: string) => void;
			type: string;
		};
	};
	forceUpdate: () => void;
};

export type FollowedSectionStreamData = {
	modelTrackingID: string;
	promotionsCampaignID: string;
	user: FollowedSectionUser;
	content: FollowedSectionStream;
	sectionType: string;
	channelLabel: string;
};

export type FollowedSectionStream = {
	__typename: string;
	id: string;
	broadcaster: FollowedSectionUser;
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

export type FollowedSectionUser = {
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

export type Chat = {
	props: {
		onSendMessage: (message: string) => void;
		channelID: string;
	};
};

export type Command = {
	name: string;
	description: string;
	helpText: string;
	permissionLevel: number;
	handler: (song: string) => void;
	commandArgs: {
		name: string;
		isRequired: boolean;
	}[];
};

/*export type ChatInput = {
	pendingProps: {
		setInputValue: (message: string, sendIt: boolean) => void;
	};
	stateNode: {
		state: {
			value: string;
		};
		forceUpdate: () => void;
	};
};*/

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

export type ChatInput = {
	stateNode: {
		state: {
			value: string;
		};
		componentRef: {
			props: {
				onChange: (event: { target: { value: string } }) => void;
			};
			focus: () => void;
		};
	};

export type ScrollableChatComponent = {
	scrollToBottom: () => void;

};
