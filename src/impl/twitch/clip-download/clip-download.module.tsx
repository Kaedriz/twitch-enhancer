import Module from "module/module";
import { ClipDownloadComponent } from "modules/twitch/clip-download/component/clip-download.component.tsx";
import { render } from "solid-js/web";
import type { TwitchEvents } from "types/events/twitch/events";
import type { ModuleConfig, ModuleEvent } from "types/module/module";
import type { TwitchLocalStorageMap } from "types/storage/twitch/local.storage";

export default class ClipDownloadModule extends Module<
	TwitchEvents,
	TwitchLocalStorageMap
> {
	protected config(): ModuleConfig {
		const urlConfig = this.utils.createSimpleUrlConfig("include", [
			"clips.twitch.tv",
		]);
		return {
			name: "clip-download",
			elements: [
				{
					selector: ".player-controls__left-control-group",
					once: true,
					urlConfig: {
						type: "include",
						check: (url) =>
							url.includes("/clip/") || url.includes("clips.twitch.tv"),
					},
				},
			],
			platform: "twitch",
		};
	}

	protected async run(event: ModuleEvent) {
		const elements = this.utils.createEmptyElements(
			this.id(),
			event.elements,
			"div",
		);
		elements.forEach((element) => {
			render(
				() => <ClipDownloadComponent click={() => this.downloadClip()} />,
				element,
			);
		});
	}

	private downloadClip() {
		window.open(document.querySelector("video")?.src);
	}
}
