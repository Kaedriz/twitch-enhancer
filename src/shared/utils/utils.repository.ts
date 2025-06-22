import CommonUtils from "$shared/utils/common.utils.ts";
import ReactUtils from "$shared/utils/react.utils.ts";

export default class UtilsRepository {
	constructor(
		readonly commonUtils: CommonUtils = new CommonUtils(),
		readonly reactUtils: ReactUtils = new ReactUtils(),
	) {}
}
