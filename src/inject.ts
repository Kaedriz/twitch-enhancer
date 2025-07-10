import type { ExtensionEnvironment } from "$types/shared/extension.types.ts";

const source: Record<ExtensionEnvironment, string> = {
	production: chrome.runtime.getURL("index.js"),
	development: `http://localhost:3360/dist/index.js?cache=${Math.random().toString()}`,
};

const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

const script = document.createElement("script");
script.type = "module";
script.id = "enhancer-script";
script.src = source[__environment__];

head.appendChild(script);
