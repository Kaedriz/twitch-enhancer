import KickModule from "$kick/kick.module.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";
import { type Signal, signal } from "@preact/signals";
import { render } from "preact";
import styled from "styled-components";

export default class StreamLatencyModule extends KickModule {
	private latencyCounter = signal(-1);
	private isLiveState = signal(false);
	private updateInterval: NodeJS.Timeout | undefined;

	static LIVE_VIDEO_DURATION = 1073741824;

	readonly config: KickModuleConfig = {
		name: "stream-latency",
		appliers: [
			{
				type: "selector",
				key: "stream-latency",
				selectors: ["#channel-chatroom"],
				callback: this.run.bind(this),
				validateUrl: (url) => {
					return !url.includes("/videos/") && !url.includes("/clips/");
				},
				once: true,
			},
		],
	};

	private run(elements: Element[]): void {
		if (elements.length > 1) {
			this.logger.debug("Found multiple elements of chat room");
		}

		if (this.updateInterval) clearInterval(this.updateInterval);
		this.updateInterval = setInterval(() => this.updateLatency(), 1000);

		for (const chatRoom of elements) {
			const span = chatRoom.firstElementChild?.querySelector<HTMLSpanElement>("span");
			if (!span) continue;
			span.textContent = "";
			render(
				<LatencyComponent
					isLive={this.isLiveState}
					latencyCounter={this.latencyCounter}
					click={this.resetPlayer.bind(this)}
				/>,
				span,
			);
		}
	}

	private updateLatency(): void {
		const video = this.getVideoElement();
		if (!video || !this.isLiveVideo(video)) {
			this.setLive(false);
			return;
		}
		this.setLive(true);
		this.latencyCounter.value = this.computeLatency(video);
	}

	private computeLatency(video: HTMLVideoElement): number {
		const { currentTime, buffered } = video;
		if (buffered.length === 0) return -1;
		const bufferEnd = buffered.end(buffered.length - 1);
		return bufferEnd - currentTime;
	}

	private resetPlayer(): void {
		const video = this.getVideoElement();
		if (!video) {
			this.logger.warn("Failed to find video element");
			return;
		}
		if (!this.isLiveVideo(video)) {
			video.currentTime = video.duration;
			return;
		}
		const latency = this.computeLatency(video);
		if (latency > 0) {
			video.currentTime += latency;
		}
	}

	private isLiveVideo(video: HTMLVideoElement): boolean {
		return video.duration === StreamLatencyModule.LIVE_VIDEO_DURATION;
	}

	private setLive(isLive: boolean): void {
		this.isLiveState.value = isLive;
	}

	private getVideoElement(): HTMLVideoElement | null {
		return document.querySelector("video");
	}
}

interface LatencyComponentProps {
	latencyCounter: Signal<number>;
	isLive: Signal<boolean>;
	click: () => void;
}

// TODO we can do shared component here
const LatencyWrapper = styled.div`
	flex-grow: 1;
	justify-content: center;
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
		if (latencyCounter.value === undefined || latencyCounter.value < 0 || Number.isNaN(latencyCounter.value)) {
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
