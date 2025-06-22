import type WorkerService from "$shared/worker/worker.service.ts";
import type { RequestConfig, RequestResponse } from "$types/shared/http-client.types.ts";
import type { WaitForConfig } from "$types/shared/utils/common.utils.types.ts";
import { defaultAllowedOrigins } from "vite";

export default class CommonUtils {
	static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

	createElementByParent(name: string, tag: keyof HTMLElementTagNameMap, parent: Element) {
		const element = document.createElement(tag);
		element.classList.add(name);
		parent.appendChild(element);
		return element;
	}

	createEmptyElements(name: string, elements: Element[], tag: keyof HTMLElementTagNameMap = "div") {
		return elements.map((parent) => this.createElementByParent(name, tag, parent));
	}

	isUUID(text: string) {
		return CommonUtils.UUID_REGEX.test(text);
	}

	createGlobalStyle(css: string): HTMLStyleElement {
		let styleElement = document.getElementById("enhancer-style") as HTMLStyleElement;

		if (!styleElement) {
			styleElement = document.createElement("style");
			styleElement.id = "enhancer-style";
			document.head.appendChild(styleElement);
		}

		styleElement.textContent += css;

		return styleElement;
	}

	isValidUrl(url: string | undefined): url is string {
		return typeof url === "string" && url.startsWith("https://") && URL.canParse(url);
	}

	async waitFor<T>(
		predicate: () => Promise<T | undefined> | T | undefined,
		callback: (result: T, retry: number) => Promise<void> | void,
		config?: WaitForConfig,
	) {
		if (config?.initialDelay) await this.delay(config.initialDelay);
		const retries = config?.maxRetries ?? 1;
		for (let i = 0; i < retries; i++) {
			const result = await predicate();
			if (result) {
				await callback(result, i);
				return;
			}
			if (i < retries - 1) {
				await this.delay(config?.delay ?? 100);
			}
		}
	}

	async delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async getIcon(workerApi: WorkerService, path: string, defaultPath = ""): Promise<string> {
		const response = await workerApi.send("getAssetsFile", { path });
		return response?.url || defaultPath;
	}
}

class UnexpectedStatusError extends Error {}
