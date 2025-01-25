import CommonUtils from "utils/common.utils.ts";
import ReactUtils from "utils/react/react.utils.ts";
import TwitchUtils from "utils/twitch/twitch.utils.ts";

export default class Utils {
	readonly commonUtils;
	readonly reactUtils;
	readonly twitchUtils;

	constructor() {
		this.commonUtils = new CommonUtils();
		this.reactUtils = new ReactUtils();
		this.twitchUtils = new TwitchUtils(this.reactUtils);
	}
}
