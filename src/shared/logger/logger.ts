import type { LogType } from "types/shared/logger/logger.types.ts";

export default class Logger {
	static readonly LOGGER_PREFIX = "\x1B[1;38;2;145;71;255m[Enhancer]";
	static readonly LOG_TYPE_PREFIX: Record<LogType, string> = {
		debug: "\x1B[38;2;102;204;255mDEBUG\x1B[0m",
		info: "\x1B[38;2;102;255;178mINFO\x1B[0m",
		warn: "\x1B[38;2;255;215;102mWARN\x1B[0m",
		error: "\x1B[38;2;255;99;99mERROR\x1B[0m",
	};

	constructor(private readonly enableDebugLogs = false) {}

	debug(...data: any) {
		if (this.enableDebugLogs) this.send("debug", ...data);
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
		console[logType](`${Logger.LOGGER_PREFIX} ${Logger.LOG_TYPE_PREFIX[logType]}`, ...data);
	}
}
