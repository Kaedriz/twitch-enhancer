export const ChattersQuery = `query GetChannelChattersCount($name: String!) {
        channel(name: $name) {
            chatters {
                count
            }
        }
    }`;

export type ChattersResponse = {
	channel: {
		chatters: {
			count: number;
		};
	};
};
