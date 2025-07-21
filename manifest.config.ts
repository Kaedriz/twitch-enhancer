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
				all_frames: true,
				run_at: "document_end",
			},
		],
		background: {
			scripts: ["worker.background.js"],
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
					"twitch.constants.js",
					"kick.constants.js",
					"assets/enhancer/*.svg",
					"assets/enhancer/*.png",
					"assets/brands/*.svg",
					"assets/brands/*.png",
					"assets/settings/*.svg",
					"assets/settings/*.png",
					"assets/modules/*.png",
					"assets/modules/*.svg",
				],
			},
		],
		browser_specific_settings: {
			gecko: {
				id: "{09b8dba2-ae33-4bea-8bf1-d85e50691408}",
			},
		},
		// Firefox Normal {09b8dba2-ae33-4bea-8bf1-d85e50691408}
		// Firefox Dev {7ddb770a-37fb-48ce-b1fb-0afaf281fa0b}
	};
}
