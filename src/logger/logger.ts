import type { ExtensionMode } from "types/extension";
import type { LogType } from "types/logger/logger";

export default class Logger {
	private development = false;
	private readonly PREFIX = "\x1B[1;38;2;145;71;255m[Enhancer]";
	private readonly LOGS: Record<LogType, string> = {
		debug: "\x1B[38;2;102;204;255mDEBUG\x1B[0m",
		info: "\x1B[38;2;102;255;178mINFO\x1B[0m",
		warn: "\x1B[38;2;255;215;102mWARN\x1B[0m",
		error: "\x1B[38;2;255;99;99mERROR\x1B[0m",
	};

	constructor(mode: ExtensionMode) {
		this.development = mode === "development";
	}

	debug(...data: any) {
		if (this.development) this.send("debug", ...data);
	}

	info(...data: any) {
		this.send("info", ...data);
	}

	warn(...data: any) {
		this.send("warn", ...data);
	}

	error(...data: any) {
		this.send("error", ...data);
	}

	private send(logType: LogType, ...data: any[]) {
		console[logType](`${this.PREFIX} ${this.LOGS[logType]}`, ...data);
	}
}
