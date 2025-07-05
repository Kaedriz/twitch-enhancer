import KickModule from "$kick/kick.module.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";
import { type Signal, signal } from "@preact/signals";
import { render } from "preact";
import styled from "styled-components";

export default class StreamLatencyModule extends KickModule {
	private latencyCounter = signal<number>(-1);
	private isLiveState = signal<boolean>(true);
	private intervalId: number | null = null;

	readonly config: KickModuleConfig = {
		name: "stream-latency",
		appliers: [
			{
				type: "selector",
				key: "stream-latency",
				selectors: ["#channel-chatroom"],
				callback: this.run.bind(this),
				validateUrl: (url) => {
					return url.includes("/videos/") && !url.includes("/clips/");
				},
				once: true,
			},
		],
	};

	private run(elements: Element[]) {
		if (elements.length > 1) this.logger.debug("Found multiple elements of chat room");
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}

		elements.forEach((chatRoom) => {
			const header = chatRoom.firstElementChild;
			if (!header) return;
			const text = header.querySelector("span");
			if (!text) return;
			text.style.display = "none";
			render(
				<LatencyComponent
					isLive={this.isLiveState}
					latencyCounter={this.latencyCounter}
					click={this.resetPlayer.bind(this)}
				/>,
				header,
			);
		});

		const chatroom = document.getElementById("channel-chatroom");
		if (!chatroom) return;

		const headerDiv = Array.from(chatroom.children).find((el) => el.tagName === "DIV") as HTMLElement | undefined;
		if (!headerDiv) return;

		const span = headerDiv.querySelector("span");
		if (!span) return;

		const custom = document.createElement("div");
		custom.id = this.getId();

		headerDiv.replaceChild(custom, span);

		this.updateLatency();
		this.intervalId = window.setInterval(() => this.updateLatency(), 1000);

		render(
			<LatencyComponent
				isLive={this.isLiveState}
				latencyCounter={this.latencyCounter}
				click={this.resetPlayer.bind(this)}
			/>,
			custom,
		);
	}

	private updateLatency() {
		const video = document.querySelector("video");
		if (!video) {
			this.isLiveState.value = false;
			return;
		}

		this.isLiveState.value = true;
		const currentTime = video.currentTime;
		const buffered = video.buffered;

		if (buffered.length > 0) {
			const bufferEnd = buffered.end(buffered.length - 1);
			const delay = bufferEnd - currentTime;
			this.latencyCounter.value = Math.round(delay);
		} else {
			this.latencyCounter.value = -1;
		}
	}

	private resetPlayer() {
		const video = document.querySelector("video");
		if (!video) {
			this.logger.warn("Failed to find video element");
			return;
		}

		const currentPosition = video.currentTime;
		const latency = this.latencyCounter.value;

		if (latency > 0) {
			video.currentTime = currentPosition + latency;
		}
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
