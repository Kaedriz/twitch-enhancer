export type RequestConfig = {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
	body?: string | FormData | URLSearchParams | ReadableStream | null;
	headers?: Record<string, string>;
	responseType?: "json" | "text" | "blob" | "arrayBuffer";
	validateStatus?: (status: number) => boolean;
	timeout?: number;
};

export type RequestResponse<T> = {
	data: T;
	status: number;
	response: Response;
	headers: Headers;
};
