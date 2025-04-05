import type Logger from "logger";
import type { Platform } from "types/content/extension.ts";
import type UtilsRepository from "utils/utils-repository.ts";
import Api from "../api.ts";
import EnhancerApiRequest from "./enhancer-api-request.ts";
import EnhancerApiState from "./enhancer-api-state.ts";

export default class EnhancerApi extends Api {
	readonly request;
	readonly state;

	constructor(
		logger: Logger,
		protected readonly platform: Platform,
		utilsRepository: UtilsRepository,
	) {
		super(logger);
		this.request = new EnhancerApiRequest(logger, platform, utilsRepository);
		this.state = new EnhancerApiState(logger, this.request);
	}

	async initialize() {
		await this.state.initialize();
	}

	findUserBadgesForCurrentChannel(externalUserId: string) {
		const globalBadges = this.state.getGlobalBadges();
		const badges = this.state.getBadges();

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
}
