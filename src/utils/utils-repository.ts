import type Logger from "logger";
import CommonUtils from "utils/common-utils.ts";
import ReactUtils from "./react-utils.ts";

export default class UtilsRepository {
	readonly reactUtils: ReactUtils;
	readonly commonUtils: CommonUtils;

	constructor(private readonly logger: Logger) {
		this.reactUtils = new ReactUtils(this.logger);
		this.commonUtils = new CommonUtils(this.logger);
	}
}
