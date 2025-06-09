import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import type { ModuleConfig } from "$types/shared/module.types.ts";
import { type Signal, signal } from "@preact/signals";
import { render } from "preact";
import styled from "styled-components";
import TwitchModule from "../../twitch.module.ts";

export default class StreamLatencyModule extends TwitchModule {
	private latencyCounter = {} as Signal<number>;
	private isLiveState = {} as Signal<boolean>;

	readonly config: ModuleConfig<TwitchEvents> = {
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
		const wrappers = elements.map((element) => {
			const wrapper = document.createElement("span");
			wrapper.id = this.getId();
			element.appendChild(wrapper);
			return wrapper;
		});

		this.createLatencyCounter();
		this.updateLatency();
		setInterval(async () => this.updateLatency(), 1000);

		wrappers.forEach((element: HTMLElement) => {
			const header = document.querySelector("#chat-room-header-label") as HTMLElement | null;
			if (header) header.style.display = "none";
			render(
				<LatencyComponent
					isLive={this.isLiveState}
					latencyCounter={this.latencyCounter}
					click={this.resetPlayer.bind(this)}
				/>,
				element,
			);
		});
	}

	private updateLatency() {
		const currentLiveStatus = this.twitchUtils().getCurrentLiveStatus();
		if (!currentLiveStatus) {
			return;
		}
		const isLive = !currentLiveStatus.isOffline && currentLiveStatus.isLive;
		this.isLiveState.value = isLive;
		if (!isLive) {
			return;
		}
		const latency = this.getLatency(false);
		if (latency === undefined || latency < 0) return;
		this.latencyCounter.value = latency;
	}

	private resetPlayer() {
		const mediaPlayer = this.twitchUtils().getMediaPlayerInstance();
		if (!mediaPlayer) {
			this.logger.warn("Failed to find media player");
			return;
		}
		const currentPosition = mediaPlayer.getPosition();
		const latency = this.getLatency(true);
		if (latency === undefined || latency < 0) return;
		mediaPlayer.seekTo(currentPosition + latency);
	}

	private getLatency(includeBuffer: boolean) {
		const mediaPlayer = this.twitchUtils().getMediaPlayerInstance();
		if (!mediaPlayer) {
			this.logger.warn("Failed to find media player");
			return;
		}
		const liveLatency = mediaPlayer.core.state.liveLatency;
		const ingestLatency = mediaPlayer.core.state.ingestLatency;
		return includeBuffer ? ingestLatency : liveLatency + ingestLatency;
	}

	private createLatencyCounter() {
		if ("value" in this.latencyCounter) return;
		this.latencyCounter = signal(-1);
		this.isLiveState = signal(true);
	}
}

interface LatencyComponentProps {
	latencyCounter: Signal<number>;
	isLive: Signal<boolean>;
	click: () => void;
}

const LatencyWrapper = styled.div`
	display: flex;
	align-items: center;
	padding: 6px 12px;
	color: #dedee3;
	font-weight: 600;
	font-size: 14px;
	transition: all 0.2s ease;
	user-select: none;

	&:hover {
		color: #ffffff;
		cursor: pointer;
		transform: translateY(-1px);
	}
`;

const StatusDot = styled.span<{ isLive: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${({ isLive }) => (isLive ? "#ff4d4d" : "#888")};
`;

function LatencyComponent({ click, latencyCounter, isLive }: LatencyComponentProps) {
	const formatLatency = () => {
		if (latencyCounter.value === undefined || latencyCounter.value < 0) {
			return "Loading...";
		}
		return `${latencyCounter.value.toFixed(2)}s`;
	};

	return (
		<LatencyWrapper onClick={click}>
			<StatusDot isLive={isLive.value} />
			{isLive.value ? `Latency: ${formatLatency()}` : "OFFLINE"}
		</LatencyWrapper>
	);
}
