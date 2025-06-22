import { VideoCreatedAtQuery } from "$twitch/apis/twitch-queries.ts";
import TwitchModule from "$twitch/twitch.module.ts";
import type { VideoCreatedAtResponse } from "$types/platforms/twitch/twitch.api.types.ts";
import type { MediaPlayerInstance } from "$types/platforms/twitch/twitch.utils.types.ts";
import type { TwitchModuleConfig } from "$types/shared/module/module.types.ts";
import { type Signal, signal } from "@preact/signals";
import { render } from "preact";
import styled from "styled-components";

export default class RealVideoTimeModule extends TwitchModule {
	private static URL_CONFIG = (url: string) => {
		return url.includes("/videos/") || url.includes("/video/");
	};

	config: TwitchModuleConfig = {
		name: "real-video-time",
		appliers: [
			{
				type: "selector",
				selectors: [".player-controls__left-control-group"],
				callback: this.run.bind(this),
				key: "real-video-time",
				validateUrl: RealVideoTimeModule.URL_CONFIG,
				once: true,
			},
			{
				type: "event",
				event: "twitch:chatInitialized",
				callback: () => {
					if (!RealVideoTimeModule.URL_CONFIG(window.location.href)) {
						const elements = document.querySelectorAll(".enhancer-real-video-time");
						elements.forEach((element) => element.remove());
					}
				},
				key: "real-video-time-url-validator",
			},
		],
	};

	private timeCounter = {} as Signal<number>;
	private currentVideoId: string | undefined;
	private timeInterval: NodeJS.Timeout | undefined;
	private videoCreatedAt = new Date(0);
	private mediaPlayer: MediaPlayerInstance | undefined;

	private async run(elements: Element[]) {
		this.createTimeCounter();
		await this.updateCurrentVideo();
		const wrappers = this.commonUtils().createEmptyElements(this.getId(), elements, "span");
		wrappers.forEach((element) => {
			render(<RealTimeComponent time={this.timeCounter} />, element);
		});
		this.updateTime();
		if (this.timeInterval) {
			clearInterval(this.timeInterval);
		}
		this.timeInterval = setInterval(async () => {
			await this.updateCurrentVideo();
			this.updateTime();
		}, 1000);
	}

	private async getVideoCreatedAt(videoId: string) {
		const { data } = await this.getVideoTime(videoId);
		return new Date(data.video.createdAt);
	}

	private createTimeCounter() {
		if ("value" in this.timeCounter) return;
		this.timeCounter = signal<number>(-1);
	}

	private async updateCurrentVideo() {
		const videoId = this.twitchUtils().getVideoIdFromLink(window.location.href);
		if (!videoId) {
			return this.logger.warn("Failed to find video id");
		}
		if (this.currentVideoId === videoId) return;
		this.currentVideoId = videoId;
		this.videoCreatedAt = await this.getVideoCreatedAt(videoId);
		this.logger.debug(`Creating real video time counter for ${videoId}`, this.videoCreatedAt);
	}

	private updateTime() {
		const mediaPlayerInstance = this.mediaPlayer ?? this.twitchUtils().getMediaPlayerInstance();
		if (!mediaPlayerInstance) {
			this.logger.error("Failed to find media player instance");
			return;
		}
		this.mediaPlayer = mediaPlayerInstance;
		this.timeCounter.value = this.videoCreatedAt.getTime() + mediaPlayerInstance.getPosition() * 1000;
	}

	private async getVideoTime(videoId: string) {
		return this.twitchApi().gql<VideoCreatedAtResponse>(VideoCreatedAtQuery, {
			id: videoId,
		});
	}
}

interface RealVideoTimeComponentProps {
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

function RealTimeComponent({ time }: RealVideoTimeComponentProps) {
	return <Wrapper>{formatTimestampToHHMMSS(time.value)}</Wrapper>;
}

function formatTimestampToHHMMSS(timestampMs: number): string {
	const date = new Date(timestampMs);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const seconds = date.getSeconds().toString().padStart(2, "0");
	return `${hours}:${minutes}:${seconds}`;
}
