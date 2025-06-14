import { Logger } from "$shared/logger/logger.ts";
import { HandlerRegistry } from "$shared/worker/handlers/handler.registry.ts";
import { WatchtimeService } from "$shared/worker/watchtime/watchtime.service.ts";

export default class WorkerBackground {
	private readonly logger = new Logger({ context: "background" });
	private readonly watchtimeService = new WatchtimeService();
	private readonly handlerRegistry = new HandlerRegistry(this.logger, this.watchtimeService);

	async start() {
		this.setupMessageListener();
		await this.watchtimeService.initialize();
		this.logger.info("Background worker started");
	}

	private setupMessageListener() {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			this.handleMessage(message)
				.then(sendResponse)
				.catch((error) => {
					this.logger.error("Message handling failed:", error);
					sendResponse({ error: error.message });
				});

			return true;
		});
	}

	private async handleMessage(message: { action: string; payload?: any }) {
		const { action, payload } = message;
		if (!this.handlerRegistry.hasHandler(action)) {
			throw new Error(`Unknown action: ${action}`);
		}
		const handler = this.handlerRegistry.getHandler(action);
		return await handler.handle(payload);
	}
}

(async () => {
	const backgroundWorker = new WorkerBackground();
	await backgroundWorker.start();
})();
