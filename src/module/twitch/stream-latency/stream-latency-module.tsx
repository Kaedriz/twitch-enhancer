import { type Signal, signal } from "@preact/signals";
import Module from "module/core/module.ts";
import { render } from "preact";
import styled from "styled-components";
import type { ModuleConfig } from "types/module/module.types.ts";
import type { MediaPlayerInstance } from "types/utils/twitch-utils.types.ts";

export default class StreamLatencyModule extends Module {
	private mediaPlayer: MediaPlayerInstance | undefined;
	private latencyCounter = {} as Signal<number>;

	config: ModuleConfig = {
		name: "stream-latency",
		appliers: [
			{
				type: "selector",
				key: "stream-latency",
				selectors: [".stream-chat-header"],
				callback: this.run.bind(this),
				validateUrl: (url) => {
					return !url.includes("/popout/");
				},
				once: true,
			},
		],
	};

	private run(elements: Element[]) {
		const wrappers = this.utilsRepository.commonUtils.createEmptyElements(this.getId(), elements, "span");
		this.createLatencyCounter();
		this.updateLatency();
		setInterval(async () => this.updateLatency(), 1000);
		wrappers.forEach((element) => {
			const header = document.querySelector("#chat-room-header-label") as HTMLElement | null;
			if (header) header.style.display = "none";
			return render(<LatencyComponent counter={this.latencyCounter} click={this.resetPlayer.bind(this)} />, element);
		});
	}

	private updateLatency() {
		this.latencyCounter.value = this.getLatency(false);
	}

	private resetPlayer() {
		const currentPosition = this.getMediaPlayer().getPosition();
		const latency = this.getLatency(true);
		if (latency < 0) return;
		this.getMediaPlayer().seekTo(currentPosition + latency);
	}

	private getMediaPlayer() {
		if (!this.mediaPlayer) {
			this.mediaPlayer = this.utilsRepository.twitchUtils.getMediaPlayerInstance();
			if (!this.mediaPlayer) {
				throw new Error("Cannot find MediaPlayerInstance");
			}
		}
		return this.mediaPlayer;
	}

	private getLatency(includeBuffer: boolean) {
		const liveLatency = this.getMediaPlayer().core.state.liveLatency;
		const ingestLatency = this.getMediaPlayer().core.state.ingestLatency;
		return includeBuffer ? ingestLatency : liveLatency + ingestLatency;
	}

	private createLatencyCounter() {
		if ("value" in this.latencyCounter) return;
		this.latencyCounter = signal<number>(-1);
	}
}

interface LatencyComponentProps {
	counter: Signal<number>;
	click: () => void;
}

const Wrapper = styled.div`
	color: #dedee3;
	font-weight: 600 !important;
	justify-content: center;
	text-transform: capitalize;

	&:hover {
		opacity: 0.75;
		cursor: pointer;
	}
`;

function LatencyComponent({ click, counter }: LatencyComponentProps) {
	return (
		<Wrapper onClick={click}>
			Latency: {!counter.value || counter.value < 0 ? "Loading..." : `${counter.value.toFixed(2)}s`}
		</Wrapper>
	);
}
