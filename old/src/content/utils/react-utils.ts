import type { ReactComponent } from "types/content/utils/react-utils.types.ts";
import Utils from "./utils.ts";

export default class ReactUtils extends Utils {
	findReactParents<T>(
		node: any,
		predicate: (node: any) => boolean,
		maxDepth = 15,
		depth = 0,
	): ReactComponent<T> | null {
		let success = false;
		try {
			success = predicate(node);
		} catch (_) {}
		if (success) return node;
		if (!node || depth > maxDepth) return null;

		const { return: parent } = node;
		if (parent) {
			return this.findReactParents(parent, predicate, maxDepth, depth + 1);
		}

		return null;
	}

	findReactChildren<T>(
		node: any,
		predicate: (node: any) => boolean,
		maxDepth = 15,
		depth = 0,
	): ReactComponent<T> | null {
		let success = false;
		try {
			success = predicate(node);
		} catch (_) {}
		if (success) return node;
		if (!node || depth > maxDepth) return null;

		const { child, sibling } = node;
		if (child || sibling) {
			return (
				this.findReactChildren(child, predicate, maxDepth, depth + 1) ||
				this.findReactChildren(sibling, predicate, maxDepth, depth + 1)
			);
		}

		return null;
	}

	getReactInstance(element: Element | Node | null) {
		for (const k in element) {
			if (k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$")) {
				return (element as any)[k];
			}
		}
	}
}
