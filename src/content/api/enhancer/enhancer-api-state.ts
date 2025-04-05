import type Logger from "logger";
import type { EnhancerResponseMap } from "types/api/enhancer-api.types.ts";
import type EnhancerApiRequest from "./enhancer-api-request.ts";

export default class EnhancerApiState {
	constructor(
		protected readonly logger: Logger,
		protected readonly request: EnhancerApiRequest,
	) {}

	private currentChannelId = "";
	private readonly cache: Partial<EnhancerResponseMap> = {};

	async initialize() {
		this.saveResponseToCache("global-badge", await this.request.getGlobalBadges());
	}

	async joinChannel(channelId: string) {
		if (channelId === this.currentChannelId) return;
		try {
			this.saveResponseToCache("channel", await this.request.getChannel(channelId));
			this.saveResponseToCache("badges", await this.request.getBadges(channelId));
			this.currentChannelId = channelId;
			this.logger.debug(`Joined ${channelId} channel`);
		} catch (error) {
			this.logger.warn(`Couldn't get data for channel ${channelId}: ${error}`);
		}
	}

	getChannel() {
		return this.getCachedResponse("channel");
	}

	getBadges() {
		return this.getCachedResponse("badges");
	}

	getGlobalBadges() {
		// TODO If missing then try to get again
		return this.getCachedResponse("global-badge");
	}

	private saveResponseToCache<T extends keyof EnhancerResponseMap>(
		key: T,
		response: EnhancerResponseMap[T],
	): EnhancerResponseMap[T] {
		this.cache[key] = response;
		return response;
	}

	private getCachedResponse<T extends keyof EnhancerResponseMap>(key: T): EnhancerResponseMap[T] | undefined {
		return this.cache[key];
	}
}
