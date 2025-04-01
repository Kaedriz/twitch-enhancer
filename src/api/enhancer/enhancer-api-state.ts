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
		this.logger.debug(`Joined ${channelId} channel`);
		// TODO Check if response is cached, if not then request again
		this.saveResponseToCache("channel", await this.request.getChannel(channelId));
		this.saveResponseToCache("badges", await this.request.getBadges(channelId));
	}

	getChannel() {
		return this.getCachedResponse("channel");
	}

	getBadges() {
		return this.getCachedResponse("badges");
	}

	getGlobalBadges() {
		return this.getCachedResponse("global-badge");
	}

	private saveResponseToCache<T extends keyof EnhancerResponseMap>(
		key: T,
		response: EnhancerResponseMap[T],
	): EnhancerResponseMap[T] {
		this.cache[key] = response;
		return response;
	}

	private getCachedResponse<T extends keyof EnhancerResponseMap>(key: T): EnhancerResponseMap[T] {
		return this.cache[key] as EnhancerResponseMap[T];
	}
}
