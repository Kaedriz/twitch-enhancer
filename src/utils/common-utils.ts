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
}
