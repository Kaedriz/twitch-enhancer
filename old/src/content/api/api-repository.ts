import type { Platform } from "types/content/extension.ts";
import type Logger from "../../shared/logger/logger.ts";
import type UtilsRepository from "../utils/utils-repository.ts";
import EnhancerApi from "./enhancer/enhancer-api.ts";
import TwitchApi from "./twitch/twitch-api.ts";

export default class ApiRepository {
	readonly enhancerApi: EnhancerApi;
	readonly twitchApi: TwitchApi;
	constructor(
		protected readonly logger: Logger,
		platform: Platform,
		utilsRepository: UtilsRepository,
	) {
		this.enhancerApi = new EnhancerApi(this.logger, platform, utilsRepository);
		this.twitchApi = new TwitchApi(this.logger);
	}

	async initialize() {
		try {
			await this.enhancerApi.initialize();
		} catch (error) {
			this.logger.error("Couldn't initialize APIs", error);
		}
	}
}
