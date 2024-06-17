export default class CommonUtils {
	getCurrentChannel() {
		throw new Error("Not implemented");
	}

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
		id: string,
		tag: keyof HTMLElementTagNameMap,
		parent: Element,
	) {
		const element = document.createElement(tag);
		element.id = id;
		parent.appendChild(element);
		return element;
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
}
