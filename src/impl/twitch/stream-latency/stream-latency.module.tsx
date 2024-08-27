import Module from "module/module.ts";
import { StreamLatencyComponent } from "modules/twitch/stream-latency/component/stream-latency.component.tsx";
import { type Accessor, type Setter, createSignal } from "solid-js";
import { render } from "solid-js/web";
import type { TwitchEvents } from "types/events/twitch/events.d.ts";
import type { ModuleConfig, ModuleEvent } from "types/module/module.d.ts";
import type { TwitchLocalStorageMap } from "types/storage/twitch/local.storage.d.ts";
import type { MediaPlayer } from "types/utils/react.d.ts";

export default class StreamLatencyModule extends Module<
	TwitchEvents,
	TwitchLocalStorageMap
> {
	private latencyUpdater: Timer | undefined;

	private mediaPlayer: MediaPlayer | undefined;

	private counterInitialized = false;
	private latency: Accessor<number> = {} as Accessor<number>;
	private setLatency: Setter<number> = {} as Setter<number>;

	protected config(): ModuleConfig {
		return {
			name: "stream-latency",
			elements: [
				{
					selector: ".stream-chat-header",
					once: true,
					urlConfig: {
						type: "exclude",
						check: (url) => url.includes("/popout/"),
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
			"span",
		);
		this.updateMediaPlayer();
		this.createLatencyCounter();
		await this.update();
		if (this.latencyUpdater) clearInterval(this.latencyUpdater);
		this.latencyUpdater = setInterval(async () => await this.update(), 1000);
		elements.forEach((element) => {
			const header = document.querySelector(
				"#chat-room-header-label",
			) as HTMLElement | null;
			if (header) header.style.display = "none";
			//TODO Add utils function to hide elements
			return render(
				() => (
					<StreamLatencyComponent
						latency={this.latency()}
						click={() => this.resetPlayer()}
					/>
				),
				element,
			);
		});
	}

	private updateMediaPlayer() {
		this.mediaPlayer = this.utils.twitch.getMediaPlayerInstance();
	}

	private createLatencyCounter() {
		if (!this.counterInitialized) {
			this.counterInitialized = true;
			const [latency, setLatency] = createSignal(0);
			this.latency = latency;
			this.setLatency = setLatency;
		}
	}

	private async update() {
		this.setLatency(this.getLatency());
	}

	private async resetPlayer() {
		if (this.mediaPlayer === undefined) return;
		const currentPosition = this.mediaPlayer.getPosition();
		const latency = this.getLatency(false);
		if (latency === -1) return;
		this.mediaPlayer.seekTo(currentPosition + latency + 1);
	}

	private getLatency(includeStreamersLatency = true): number {
		if (!this.mediaPlayer) return -1;
		const liveLatency = this.mediaPlayer.core.state.liveLatency;
		const ingestLatency = this.mediaPlayer.core.state.ingestLatency;
		return (includeStreamersLatency ? liveLatency : 0) + ingestLatency;
	}
}
