import type {
	ModuleElementUrlConfig,
	ModuleElementUrlType,
} from "module/types.ts";
import TwitchUtils from "utils/twitch/twitch.utils.ts";

export default class CommonUtils {
	//TODO Have seperated twitch utils
	readonly twitch = new TwitchUtils();

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

	isElementAlreadyUsed(element: Element) {
		return element.hasAttribute("enhanced");
	}

	markElementAsUsed(element: Element) {
		element.setAttribute("enhanced", "true");
		element.setAttribute("enhancedAt", `${Date.now()}`);
	}

	createSimpleUrlConfig(
		type: ModuleElementUrlType,
		urls: string[],
	): ModuleElementUrlConfig {
		return {
			type,
			check: (url: string) => urls.some((_url) => url.includes(_url)),
		};
	}
}
