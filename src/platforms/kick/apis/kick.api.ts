import { HttpClient } from "$shared/http/http-client.ts";
import { Logger } from "$shared/logger/logger.ts";
import type { ChannelResponse } from "$types/platforms/kick/kick.api.types.ts";

export default class KickApi {
	private readonly logger = new Logger({ context: "kick-api" });
	private readonly httpClient = new HttpClient(this.logger);

	getChannel(channelName: string) {
		return this.httpClient.request<ChannelResponse>(`https://kick.com/api/v2/channels/${channelName}`);
	}
}
