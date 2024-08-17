export type ElementCreationConfig = {
	id: string;
	tag: keyof HTMLElementTagNameMap;
	parent: Element;
};
