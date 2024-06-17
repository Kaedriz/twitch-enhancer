import ansicolor from "ansicolor";
import type { LogType } from "./types.ts";

const LOG_TYPES_STRINGS: Record<LogType, string> = {
	debug: ansicolor.yellow("DEBUG"),
	info: ansicolor.green("INFO"),
	warn: ansicolor.lightYellow("WARN"),
	error: ansicolor.red("ERROR"),
} as const;

export default class Logger {
	// biome-ignore lint/suspicious/noExplicitAny: Allow to send anything we want as message
	debug(...data: any) {
		//TODO Check if debug mode is enabled
		this._log("debug", ...data);
	}

	// biome-ignore lint/suspicious/noExplicitAny: Allow to send anything we want as message
	info(...data: any) {
		console.info(...data);
		this._log("info", ...data);
	}

	// biome-ignore lint/suspicious/noExplicitAny: Allow to send anything we want as message
	warn(...data: any) {
		this._log("warn", ...data);
	}

	// biome-ignore lint/suspicious/noExplicitAny: Allow to send anything we want as message
	error(...data: any) {
		this._log("error", ...data);
	}

	// biome-ignore lint/suspicious/noExplicitAny: Allow to send anything we want as message
	private _log(logType: LogType, ...data: any[]) {
		console[logType](
			...ansicolor.parse(
				`${ansicolor.lightMagenta("[Enhancer]")} ${LOG_TYPES_STRINGS[logType]}`,
			).asChromeConsoleLogArguments,
			...data,
		);
	}
}
