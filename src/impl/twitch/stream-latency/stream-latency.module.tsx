import Module from "module/module.ts";
import type { ElementModuleEvent, ModuleConfig } from "module/types.ts";
import { StreamLatencyComponent } from "modules/twitch/stream-latency/component/stream-latency.component.tsx";
import { type Accessor, type Setter, createSignal } from "solid-js";
import { render } from "solid-js/web";
import type { MediaPlayer } from "utils/twitch/types.ts";

export default class StreamLatencyModule extends Module {
	private latencyUpdater: Timer | undefined;

	private mediaPlayer: MediaPlayer | undefined;

	private counterInitialized = false;
	private latency: Accessor<number> = {} as Accessor<number>;
	private setLatency: Setter<number> = {} as Setter<number>;

	protected config(): ModuleConfig {
		const urlConfig = this.utils.createSimpleUrlConfig("exclude", [
			"clips.twitch.tv",
		]);
		return {
			name: "stream-latency",
			type: "element",
			elements: [
				{
					selector: ".stream-chat-header",
					once: true,
					urlConfig,
				},
			],
			platform: "twitch",
		};
	}

	protected async run(event: ElementModuleEvent) {
		const elements = this.utils.createEmptyElements(
			this.id(),
			event.elements,
			"span",
		);
		this.createLatencyCounter();
		await this.update();
		if (this.latencyUpdater) clearInterval(this.latencyUpdater);
		this.latencyUpdater = setInterval(async () => await this.update(), 2000);
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
		const latency = this.getBufferedTime();

		if (latency === -1) return;

		const position = currentPosition + latency;

		this.mediaPlayer.seekTo(position);
	}

	private getLatency(): number {
		this.mediaPlayer = this.utils.twitch.getMediaPlayerInstance();
		if (this.mediaPlayer === undefined) return -1;
		const liveLatency = this.mediaPlayer.core.state.liveLatency;
		const ingestLatency = this.mediaPlayer.core.state.ingestLatency;
		return liveLatency + ingestLatency;
	}

	private getBufferedTime() {
		if (this.mediaPlayer === undefined) return -1;
		return this.mediaPlayer.core.state.ingestLatency;
	}
}
