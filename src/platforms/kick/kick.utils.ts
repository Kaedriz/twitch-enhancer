import type ReactUtils from "$shared/utils/react.utils.ts";

export default class KickUtils {
	constructor(protected readonly reactUtils: ReactUtils) {}

	getSigma() {
		return "sigma";
	}
}
