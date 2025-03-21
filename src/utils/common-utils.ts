import Utils from "utils/utils.ts";

export default class CommonUtils extends Utils {
	static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	static readonly STYLE_ELEMENT_ID = "enhancer-style";

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

	createGlobalStyle(css: string, styleId: string = CommonUtils.STYLE_ELEMENT_ID): HTMLStyleElement {
		let styleElement = document.getElementById(styleId) as HTMLStyleElement;

		if (!styleElement) {
			styleElement = document.createElement("style");
			styleElement.id = styleId;
			document.head.appendChild(styleElement);
		}

		styleElement.innerHTML += `\n${css}`;

		return styleElement;
	}
}
