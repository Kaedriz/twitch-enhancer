import type {
	EnhancerBadgesResponseDto,
	EnhancerChannelDto,
	EnhancerStreamerWatchTimeData,
} from "types/content/apis/enhancer-apis.types.ts";
import type { Platform } from "types/content/extension.ts";
import type Logger from "../../../shared/logger/logger.ts";
import type UtilsRepository from "../../utils/utils-repository.ts";

export default class EnhancerApiRequest {
	private readonly request;

	private static GLOBAL_CHANNEL_ID = "0";
	private static API_URL = "https://api.enhancer.at"; // "http://localhost:8080";

	constructor(
		protected readonly logger: Logger,
		protected readonly platform: Platform,
		utilsRepository: UtilsRepository,
	) {
		this.request = utilsRepository.commonUtils.request;
	}

	async getChannel(channelId: string) {
		const { data, status } = await this.request<EnhancerChannelDto>(
			`${EnhancerApiRequest.API_URL}/channel/${this.platform}/${channelId}`,
			{
				method: "GET",
				responseType: "json",
				validateStatus: (status) => [200, 404].includes(status),
			},
		);
		return { data, ok: status === 200, status };
	}

	async getBadges(channelId: string) {
		const { data, status } = await this.request<EnhancerBadgesResponseDto>(
			`${EnhancerApiRequest.API_URL}/badge/${this.platform}/${channelId}`,
			{
				method: "GET",
				responseType: "json",
				validateStatus: (status) => [200, 404].includes(status),
			},
		);
		return { data, ok: status === 200, status };
	}

	getGlobalBadges() {
		return this.getBadges(EnhancerApiRequest.GLOBAL_CHANNEL_ID);
	}

	async getWatchTime(username: string) {
		const { data } = await this.request<EnhancerStreamerWatchTimeData[]>(
			`${EnhancerApiRequest.API_URL}/xayo/${username}`,
			{
				method: "GET",
				validateStatus: (status) => status === 200,
				responseType: "json",
			},
		);
		return data;
	}

	getPlaysounds(channelId: string) {}
}
