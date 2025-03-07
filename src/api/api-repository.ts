import type Logger from "logger";
import TwitchApi from "./twitch/twitch-api.ts";

export default class ApiRepository {
	readonly twitchApi: TwitchApi;
	constructor(protected readonly logger: Logger) {
		this.twitchApi = new TwitchApi(this.logger);
	}
}
