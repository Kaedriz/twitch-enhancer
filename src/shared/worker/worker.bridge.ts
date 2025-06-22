import type { ExtensionMessageDetail, ExtensionResponseDetail } from "$types/shared/worker/worker.types.ts";

export default class WorkerBridge {
	private bridgeElement: HTMLElement | null = null;

	start() {
		this.waitForBridgeElement();
		this.log("WorkerService bridge starting...");
	}

	private waitForBridgeElement() {
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node instanceof HTMLElement && node.tagName === "ENHANCER-BRIDGE") {
						this.bridgeElement = node;
						this.setupMessageListener();
						observer.disconnect();
						return;
					}
				}
			}
		});
		this.bridgeElement = document.querySelector("enhancer-bridge");
		if (this.bridgeElement) {
			this.setupMessageListener();
		} else {
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}
	}

	private setupMessageListener() {
		if (!this.bridgeElement) return;
		this.log("WorkerService bridge started!");
		this.bridgeElement.addEventListener("enhancer-message", (async (event: CustomEvent<ExtensionMessageDetail>) => {
			const { messageId, action, payload } = event.detail;
			try {
				const response = await chrome.runtime.sendMessage({
					action,
					payload,
				});
				const responseEvent = new CustomEvent<ExtensionResponseDetail>("enhancer-response", {
					detail: { messageId, data: response },
				});
				// biome-ignore lint/style/noNonNullAssertion: we are checking it above, it cannot be null
				this.bridgeElement!.dispatchEvent(responseEvent);
			} catch (error) {
				const errorEvent = new CustomEvent<ExtensionResponseDetail>("enhancer-response", {
					detail: { messageId, error: (error as Error).message },
				});
				// biome-ignore lint/style/noNonNullAssertion: we are checking it above, it cannot be null
				this.bridgeElement!.dispatchEvent(errorEvent);
			}
		}) as unknown as EventListener);
	}

	private log(...data: any[]) {
		console.info("Enhancer worker-bridge", ...data);
	}
}

const bridge = new WorkerBridge();
bridge.start();
