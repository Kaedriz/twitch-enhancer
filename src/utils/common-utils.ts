import Utils from "utils/utils.ts";

export default class CommonUtils extends Utils {
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
}
