import { type Signal, signal } from "@preact/signals";
import Module from "module/module.ts";
import { render } from "preact";
import styled from "styled-components";
import type { VideoCreatedAtResponse } from "types/content/api/twitch-api.types.ts";
import type { ModuleConfig } from "types/content/module/module.types.ts";
import { VideoCreatedAtQuery } from "../../../api/twitch/twitch-queries.ts";

export default class RealTimeModule extends Module {
	private static URL_CONFIG = (url: string) => {
		return url.includes("/videos/");
	};

	config: ModuleConfig = {
		name: "realtime",
		appliers: [
			{
				type: "selector",
				selectors: [".player-controls__left-control-group"],
				callback: this.run.bind(this),
				key: "realtime",
				validateUrl: RealTimeModule.URL_CONFIG,
				once: true,
			},
		],
	};

	private timeCounter = {} as Signal<number>;
	private elements: Element[] = [];
	private currentVideoId: string | null = null;
	private intervalId: number | null = null;

	private async run(elements: Element[]) {
		const videoId = this.getVideoId(window.location.href);
		if (this.currentVideoId === videoId) return;
		this.cleanup();

		this.elements = elements;
		this.currentVideoId = videoId;

		const wrappers = this.commonUtils().createEmptyElements(this.getId(), elements, "span");

		const videoTime = await this.getVideoTime(videoId);
		const createdAtMs = Date.parse(videoTime.data.video.createdAt);

		this.createTimeCounter();
		await this.updateTimeCounter(createdAtMs);

		this.intervalId = window.setInterval(() => this.updateTimeCounter(createdAtMs), 1000);
		wrappers.forEach((element) => {
			render(<RealTimeComponent time={this.timeCounter} />, element);
		});
	}

	private createTimeCounter() {
		if ("value" in this.timeCounter) return;
		this.timeCounter = signal<number>(-1);
	}

	private cleanup() {
		this.elements.forEach((element) => {
			const existing = element.querySelector(`.${this.getId()}`);
			if (existing) existing.remove();
		});
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		this.timeCounter = {} as Signal<number>;
		this.currentVideoId = null;
	}

	private async updateTimeCounter(createdAtMs: number) {
		if (!RealTimeModule.URL_CONFIG(window.location.href)) {
			this.cleanup();
			return;
		}
		const mediaPlayer = this.twitchUtils().getMediaPlayerInstance();
		if (!mediaPlayer) {
			this.logger?.error("[RealTimeModule] Media player not available");
			return;
		}
		const currentTime = mediaPlayer.getPosition() || 0;
		this.timeCounter.value = createdAtMs + currentTime * 1000;
	}

	private async getVideoTime(videoId: string) {
		return this.apiRepository.twitchApi.gql<VideoCreatedAtResponse>(VideoCreatedAtQuery, {
			id: videoId,
		});
	}

	private getVideoId(link: string) {
		const params = link.split("/");
		let id = params[params.indexOf("videos") + 1];
		if (id.includes("?")) id = id.substring(0, id.lastIndexOf("?"));
		return id;
	}
}

interface RealTimeComponentProps {
	time: Signal<number>;
}

const Wrapper = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: #efeff1;
	margin: 0 8px;
	height: 100%;
	font-size: 14px;
	font-weight: normal;
	position: relative;
	vertical-align: middle;
`;

function RealTimeComponent({ time }: RealTimeComponentProps) {
	function formatTimestampToHHMMSS(timestampMs: number): string {
		const date = new Date(timestampMs);
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		const seconds = date.getSeconds().toString().padStart(2, "0");
		return `${hours}:${minutes}:${seconds}`;
	}

	return <Wrapper>{formatTimestampToHHMMSS(time.value)}</Wrapper>;
}
