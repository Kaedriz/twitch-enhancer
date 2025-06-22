import type { Logger } from "$shared/logger/logger.ts";

export abstract class MessageHandler {
	constructor(protected readonly logger: Logger) {}

	abstract handle(payload?: any): Promise<any>;
}
