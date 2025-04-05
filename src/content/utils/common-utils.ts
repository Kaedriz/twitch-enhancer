import type { RequestConfig, RequestResponse } from "types/content/utils/common-utils.types.ts";
import Utils from "utils/utils.ts";

export default class CommonUtils extends Utils {
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

	async request<T>(url: string, config: RequestConfig): Promise<RequestResponse<T>> {
		const response = await fetch(url, {
			method: config.method ?? "GET",
			body: config.body ?? undefined,
		});
		if (!config.validateStatus?.(response.status)) {
			throw new UnexpectedStatusError(`Received status: ${response.status}`);
		}
		const responseType = config.responseType ?? "json";
		const data = (responseType === "json" ? await response.json() : await response.text()) as T;
		return { data, status: response.status, response };
	}
}

class UnexpectedStatusError extends Error {}
