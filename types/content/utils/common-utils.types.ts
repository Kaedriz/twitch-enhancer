export type RequestConfig = {
	method: "GET" | "HEAD" | "POST" | "PUT" | "DELETE";
	validateStatus?: (status: number) => boolean;
	responseType?: "json" | "raw";
	body?: string;
};

export type RequestResponse<T> = {
	data: T;
	status: number;
	response: Response;
};
