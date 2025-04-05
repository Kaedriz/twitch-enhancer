import type { EnhancerBadgesResponseDto, EnhancerChannelDto } from "types/api/enhancer-api.types.ts";
import type { Platform } from "types/extension.ts";
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
		const { data } = await this.request<EnhancerChannelDto>(
			`${EnhancerApiRequest.API_URL}/channel/${this.platform}/${channelId}`,
			{
				method: "GET",
				validateStatus: (status) => status === 200,
				responseType: "json",
			},
		);
		return data;
	}

	async getBadges(channelId: string): Promise<EnhancerBadgesResponseDto> {
		const { data } = await this.request<EnhancerBadgesResponseDto>(
			`${EnhancerApiRequest.API_URL}/badge/${this.platform}/${channelId}`,
			{
				method: "GET",
				validateStatus: (status) => status === 200,
				responseType: "json",
			},
		);
		return data;
	}

	getGlobalBadges() {
		return this.getBadges(EnhancerApiRequest.GLOBAL_CHANNEL_ID);
	}

	getPlaysounds(channelId: string) {}
}
