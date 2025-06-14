export type ExtensionMessageDetail = {
	messageId: string;
	action: string;
	payload?: any;
};

export type ExtensionResponseDetail = {
	messageId: string;
	data?: any;
	error?: string;
};

export interface WorkerApiActions {
	ping: {
		payload?: never;
		response: PingResponse;
	};
	getAssetsFile: {
		payload: GetAssetsFilePayload;
		response: GetAssetsFileResponse;
	};
}

export type WorkerAction = keyof WorkerApiActions;

export interface GetAssetsFilePayload {
	path: string;
}

export interface GetAssetsFileResponse {
	url: string;
}

export interface PingResponse {
	status: "alive";
	timestamp: number;
	message: string;
}
