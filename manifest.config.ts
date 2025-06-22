import data from "./package.json";

export function getManifest() {
	return {
		manifest_version: 3,
		name: "Enhancer",
		description: "Enhancer is open-sourced and free extension, which adds what is missing on streaming platforms.",
		version: data.version,
		action: {
			default_icon: "assets/enhancer/logo-128.png",
		},
		icons: {
			"128": "assets/enhancer/logo-128.png",
		},
		content_scripts: [
			{
				matches: ["*://*.twitch.tv/*", "*://*.kick.com/*"],
				js: ["inject.js", "worker.bridge.js"],
			},
		],
		background: {
			service_worker: "worker.background.js",
			type: "module",
		},
		web_accessible_resources: [
			{
				matches: ["*://*.twitch.tv/*", "*://*.kick.com/*"],
				resources: [
					"index.js",
					"index.js.map",
					"inject.js.map",
					"assets/enhancer/*.svg",
					"assets/enhancer/*.png",
					"assets/brands/*.svg",
					"assets/settings/*.svg",
				],
			},
		],
	};
}
