export type ReactComponent<T> = {
	stateNode: { props: T };
};

export type PersistentPlayerComponent = {
	content: { type: "live"; channelLogin: string };
};
