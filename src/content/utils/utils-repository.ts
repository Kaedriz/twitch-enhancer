import type Logger from "logger";
import CommonUtils from "utils/common-utils.ts";
import TwitchUtils from "utils/twitch-utils.ts";
import ReactUtils from "./react-utils.ts";

export default class UtilsRepository {
	readonly reactUtils: ReactUtils;
	readonly commonUtils: CommonUtils;
	readonly twitchUtils: TwitchUtils;

	constructor(private readonly logger: Logger) {
		this.reactUtils = new ReactUtils(this.logger);
		this.commonUtils = new CommonUtils(this.logger);
		this.twitchUtils = new TwitchUtils(this.logger, this.reactUtils);
	}
}
