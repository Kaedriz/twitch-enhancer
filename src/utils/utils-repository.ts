import type Logger from "logger";
import ReactUtils from "./react-utils.ts";

export default class UtilsRepository {
	readonly reactUtils: ReactUtils;

	constructor(private readonly logger: Logger) {
		this.reactUtils = new ReactUtils(this.logger);
	}
}
