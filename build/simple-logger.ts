import chalk, { type ChalkInstance } from "chalk";

export default class SimpleLogger {
	constructor(
		private readonly tag: string,
		private color?: ChalkInstance,
	) {}

	public log(...message: string[]) {
		this.logWithCustomPrefix(
			this.getColoredTag(this.tag),
			chalk.white(...message),
		);
	}

	public logWithCustomPrefix(symbol: string, ...message: string[]) {
		console.info(symbol, chalk.white(...message));
	}

	private getColoredTag(tag: string) {
		const _color = this.color ?? chalk.cyan.bold;
		return _color(`${tag}:`);
	}
}
