import data from "./package.json";

export function getManifest() {
	return {
		manifest_version: 3,
		name: "Enhancer",
		description: "Enhancer is open-sourced and free extension, which adds what is missing on streaming platforms.",
		version: data.version,
		action: {
			default_icon: "assets/brand/logo-128.png",
		},
		icons: {
			"128": "assets/brand/logo-128.png",
		},
		content_scripts: [
			{
				matches: ["*://*.twitch.tv/*", "*://*.kick.com/*"],
				js: ["inject.js"],
				world: "MAIN",
			},
		],
		web_accessible_resources: [
			{
				matches: ["*://*.twitch.tv/*", "*://*.kick.com/*"],
				resources: ["index.js", "index.js.map", "inject.js.map"],
			},
		],
	};
}
