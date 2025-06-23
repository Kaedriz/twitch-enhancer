import { HttpClient } from "$shared/http/http-client.ts";
import { Logger } from "$shared/logger/logger.ts";
import type {
	EnhancerBadgesResponseDto,
	EnhancerChannelDto,
	EnhancerNicknamesResponseDto,
	EnhancerStreamerWatchTimeData,
} from "$types/apis/enhancer.apis.ts";
import type { PlatformType } from "$types/shared/platform.types.ts";

interface ApiResponse<T> {
	data: T;
	ok: boolean;
	status: number;
}

export default class EnhancerApi {
	private currentChannelId = "";
	private readonly cache = new Map<string, any>();
	private isInitialized = false;

	private static readonly GLOBAL_CHANNEL_ID = "0";
	private static readonly API_URL = "https://api.enhancer.at";
	private static readonly CACHE_KEYS = {
		GLOBAL_BADGES: "global-badges",
		CHANNEL: (id: string) => `channel:${id}`,
		BADGES: (id: string) => `badges:${id}`,
		GLOBAL_NICKNAMES: "global-nicknames",
		NICKNAMES: (id: string) => `nicknames:${id}`,
	} as const;

	private readonly logger = new Logger({ context: "enhancer-api" });
	private readonly httpClient = new HttpClient(this.logger);

	constructor(private readonly platform: PlatformType) {}

	async initialize(): Promise<void> {
		if (this.isInitialized) return;

		try {
			const globalBadges = await this.fetchBadges(EnhancerApi.GLOBAL_CHANNEL_ID);
			const globalNicknames = await this.fetchNicknames(EnhancerApi.GLOBAL_CHANNEL_ID);
			if (globalBadges.ok) {
				this.cache.set(EnhancerApi.CACHE_KEYS.GLOBAL_BADGES, globalBadges.data);
				this.logger.debug("Global badges loaded successfully");
			} else {
				this.logger.warn("Failed to load global badges");
			}
			if (globalNicknames.ok) {
				this.cache.set(EnhancerApi.CACHE_KEYS.GLOBAL_NICKNAMES, globalNicknames.data);
				this.logger.debug("Global nicknames loaded successfully");
			} else {
				this.logger.warn("Failed to load global nicknames");
			}
		} catch (error) {
			this.logger.error("Error initializing EnhancerApi:", error);
		} finally {
			this.isInitialized = true;
		}
	}

	async joinChannel(channelId: string): Promise<void> {
		if (!channelId || channelId === this.currentChannelId) return;

		try {
			const [channelResult, badgesResult, nicknamesResult] = await Promise.allSettled([
				this.fetchChannel(channelId),
				this.fetchBadges(channelId),
				this.fetchNicknames(channelId),
			]);

			this.handleChannelResult(channelId, channelResult);
			this.handleBadgesResult(channelId, badgesResult);
			this.handleNicknamesResult(channelId, nicknamesResult);

			this.currentChannelId = channelId;
			this.logger.info(`Successfully joined channel: ${channelId}`);
		} catch (error) {
			this.logger.error(`Failed to join channel ${channelId}:`, error);
			throw error;
		}
	}

	getCurrentChannel(): EnhancerChannelDto | null {
		return this.getCurrentChannelData(EnhancerApi.CACHE_KEYS.CHANNEL);
	}

	getCurrentChannelBadges(): EnhancerBadgesResponseDto | null {
		return this.getCurrentChannelData(EnhancerApi.CACHE_KEYS.BADGES);
	}

	getCurrentChannelNicknames(): EnhancerNicknamesResponseDto | null {
		return this.getCurrentChannelData(EnhancerApi.CACHE_KEYS.NICKNAMES);
	}

	getGlobalBadges(): EnhancerBadgesResponseDto | null {
		return this.cache.get(EnhancerApi.CACHE_KEYS.GLOBAL_BADGES) ?? null;
	}

	getGlobalNicknames(): EnhancerNicknamesResponseDto | null {
		return this.cache.get(EnhancerApi.CACHE_KEYS.GLOBAL_NICKNAMES) ?? null;
	}

	async getChannelById(channelId: string): Promise<EnhancerChannelDto | null> {
		const cacheKey = EnhancerApi.CACHE_KEYS.CHANNEL(channelId);
		const cached = this.cache.get(cacheKey);
		if (cached) return cached;

		const result = await this.fetchChannel(channelId);
		if (result.ok) {
			this.cache.set(cacheKey, result.data);
			return result.data;
		}
		return null;
	}

	async getWatchTime(username: string): Promise<EnhancerStreamerWatchTimeData[]> {
		const { data } = await this.httpClient.request<EnhancerStreamerWatchTimeData[]>(
			`${EnhancerApi.API_URL}/xayo/${username}`,
			{
				method: "GET",
				validateStatus: (status) => status === 200,
				responseType: "json",
			},
		);
		return data;
	}

	findUserBadgesForCurrentChannel(externalUserId: string) {
		const globalBadges = this.getGlobalBadges();
		const badges = this.getCurrentChannelBadges();

		const userBadgesIds = [
			...(globalBadges?.users.find((user) => user.externalId === externalUserId)?.badgesIds ?? []),
			...(badges?.users.find((user) => user.externalId === externalUserId)?.badgesIds ?? []),
		];
		if (!userBadgesIds) return;
		return [
			...(globalBadges?.badges?.filter((badge) => userBadgesIds?.includes(badge.badgeId)) ?? []).sort(
				(a, b) => b.priority - a.priority,
			),
			...(badges?.badges?.filter((badge) => userBadgesIds?.includes(badge.badgeId)) ?? []).sort(
				(a, b) => b.priority - a.priority,
			),
		];
	}

	findUserNicknameForCurrentChannel(externalUserId: string) {
		const globalNicknames = this.getGlobalNicknames();
		const channelNicknames = this.getCurrentChannelNicknames();

		const user =
			channelNicknames?.users.find((user) => user.externalId === externalUserId) ||
			globalNicknames?.users.find((user) => user.externalId === externalUserId);
		return user || null;
	}

	getCurrentChannelId(): string {
		return this.currentChannelId;
	}

	isChannelJoined(): boolean {
		return Boolean(this.currentChannelId);
	}

	clearCache(): void {
		this.cache.clear();
		this.currentChannelId = "";
		this.isInitialized = false;
	}

	private async fetchChannel(channelId: string): Promise<ApiResponse<EnhancerChannelDto>> {
		const { data, status } = await this.httpClient.request<EnhancerChannelDto>(
			`${EnhancerApi.API_URL}/channel/${this.platform}/${channelId}`,
			{
				method: "GET",
				responseType: "json",
				validateStatus: (status) => [200, 404].includes(status),
			},
		);
		return { data, ok: status === 200, status };
	}

	private async fetchBadges(channelId: string): Promise<ApiResponse<EnhancerBadgesResponseDto>> {
		const { data, status } = await this.httpClient.request<EnhancerBadgesResponseDto>(
			`${EnhancerApi.API_URL}/badge/${this.platform}/${channelId}`,
			{
				method: "GET",
				responseType: "json",
				validateStatus: (status) => [200, 404].includes(status),
			},
		);
		return { data, ok: status === 200, status };
	}

	private async fetchNicknames(channelId: string): Promise<ApiResponse<EnhancerNicknamesResponseDto>> {
		const { data, status } = await this.httpClient.request<EnhancerNicknamesResponseDto>(
			`${EnhancerApi.API_URL}/nickname/${this.platform}/${channelId}`,
			{
				method: "GET",
				responseType: "json",
				validateStatus: (status) => [200, 404].includes(status),
			},
		);
		return { data, ok: status === 200, status };
	}

	private getCurrentChannelData<T>(keyFactory: (id: string) => string): T | null {
		if (!this.currentChannelId) return null;
		return this.cache.get(keyFactory(this.currentChannelId)) ?? null;
	}

	private handleChannelResult(channelId: string, result: PromiseSettledResult<ApiResponse<EnhancerChannelDto>>): void {
		if (result.status === "fulfilled" && result.value.ok) {
			this.cache.set(EnhancerApi.CACHE_KEYS.CHANNEL(channelId), result.value.data);
		} else {
			this.logger.warn(`Failed to fetch channel data for ${channelId}`);
		}
	}

	private handleBadgesResult(
		channelId: string,
		result: PromiseSettledResult<ApiResponse<EnhancerBadgesResponseDto>>,
	): void {
		if (result.status === "fulfilled" && result.value.ok) {
			this.cache.set(EnhancerApi.CACHE_KEYS.BADGES(channelId), result.value.data);
		} else {
			this.logger.warn(`Failed to fetch badges for ${channelId}`);
		}
	}

	private handleNicknamesResult(
		channelId: string,
		result: PromiseSettledResult<ApiResponse<EnhancerNicknamesResponseDto>>,
	): void {
		if (result.status === "fulfilled" && result.value.ok) {
			this.cache.set(EnhancerApi.CACHE_KEYS.NICKNAMES(channelId), result.value.data);
		} else {
			this.logger.warn(`Failed to fetch nicknames for ${channelId}`);
		}
	}
}
