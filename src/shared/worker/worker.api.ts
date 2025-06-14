// main-world/worker-api.ts
import { Logger } from "$shared/logger/logger.ts";
import type {
	ExtensionMessageDetail,
	ExtensionResponseDetail,
	WorkerAction,
	WorkerApiActions,
} from "$types/shared/worker.types.ts";

export default class WorkerApi {
	private readonly logger = new Logger({ context: "worker" });
	private readonly element: HTMLElement;
	private pendingMessages = new Map<string, (response: any) => void>();
	private pingInterval: number | null = null;

	constructor() {
		this.element = document.createElement("enhancer-bridge");
		document.body.appendChild(this.element);
	}

	start() {
		this.setupMessageListener();
		this.startPing();
		this.logger.info("WorkerApi started");
	}

	stop() {
		if (this.pingInterval) {
			clearInterval(this.pingInterval);
			this.pingInterval = null;
		}
	}

	private startPing() {
		this.pingInterval = window.setInterval(async () => {
			try {
				const response = await this.send("ping", undefined);
				this.logger.debug("Ping response:", response);
			} catch (error) {
				this.logger.error("Ping failed:", error);
			}
		}, 5000);
	}

	private setupMessageListener() {
		this.element.addEventListener("enhancer-response", ((event: CustomEvent<ExtensionResponseDetail>) => {
			const { messageId, data, error } = event.detail;
			const resolver = this.pendingMessages.get(messageId);
			if (resolver) {
				this.pendingMessages.delete(messageId);
				if (error) {
					throw new Error(error);
				}
				resolver(data);
			}
		}) as unknown as EventListener);
	}

	// Fully typed send method
	async send<T extends WorkerAction>(
		action: T,
		...args: WorkerApiActions[T]["payload"] extends never ? [] : [WorkerApiActions[T]["payload"]]
	): Promise<WorkerApiActions[T]["response"] | null> {
		return new Promise((resolve) => {
			const messageId = crypto.randomUUID();
			this.pendingMessages.set(messageId, resolve);

			const payload = args.length > 0 ? args[0] : undefined;
			const event = new CustomEvent<ExtensionMessageDetail>("enhancer-message", {
				detail: { messageId, action, payload },
			});

			this.element.dispatchEvent(event);

			setTimeout(() => {
				if (this.pendingMessages.has(messageId)) {
					this.pendingMessages.delete(messageId);
					resolve(null);
				}
			}, 10000);
		});
	}
}
