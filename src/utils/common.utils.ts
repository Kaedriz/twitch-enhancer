import type { ModuleUrlConfig, ModuleUrlType } from "types/module/module.d.ts";
import type { QueueConfig, QueueValue } from "types/utils/queue.d.ts";
import Queue from "utils/queue/queue.ts";
import TwitchUtils from "utils/twitch/twitch.utils.ts";

export default class CommonUtils {
	//TODO Have seperated twitch utils
	readonly twitch = new TwitchUtils();

	static readonly UUID_REGEX =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

	createElementByParentSelector(
		id: string,
		tag: keyof HTMLElementTagNameMap,
		parentSelector: string,
	) {
		const parent = document.querySelector(parentSelector);
		if (!parent) return;
		return this.createElementByParent(id, tag, parent);
	}

	createElementByParent(
		name: string,
		tag: keyof HTMLElementTagNameMap,
		parent: Element,
	) {
		const element = document.createElement(tag);
		element.classList.add(name);
		parent.appendChild(element);
		return element;
	}

	createEmptyElements(
		name: string,
		elements: Element[],
		tag: keyof HTMLElementTagNameMap = "div",
	) {
		return elements.map((parent) =>
			this.createElementByParent(name, tag, parent),
		);
	}

	getElementParent(selector: string) {
		const element = document.querySelector(selector);
		return element?.parentElement || undefined;
	}

	removeElement(selector: string) {
		const element = document.querySelector(selector);
		if (!element) return false;
		element.remove();
		return true;
	}

	elementAlreadyExists(selector: string) {
		return !!document.querySelector(selector);
	}

	isElementAlreadyUsed(element: Element, id: string) {
		const modules = element.getAttribute("enhancedModules")?.split(";") ?? [];
		return element.hasAttribute("enhanced") && modules.includes(id);
	}

	markElementAsUsed(element: Element, id: string) {
		element.setAttribute("enhanced", "true");
		element.setAttribute("enhancedAt", `${Date.now()}`);
		const modules = new Set(
			element.getAttribute("enhancedModules")?.split(";") ?? [],
		);
		modules.add(id);
		element.setAttribute("enhancedModules", [...modules].join(";"));
	}

	createSimpleUrlConfig(type: ModuleUrlType, urls: string[]): ModuleUrlConfig {
		return {
			type,
			check: (url: string) => urls.some((_url) => url.includes(_url)),
		};
	}

	createQueue<T extends QueueValue>(config: QueueConfig) {
		return new Queue<T>(config);
	}

	isUUID(text: string) {
		return CommonUtils.UUID_REGEX.test(text);
	}
}
