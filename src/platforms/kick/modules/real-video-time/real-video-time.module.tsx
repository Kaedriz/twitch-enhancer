import KickModule from "$kick/kick.module.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";
import { type Signal, signal } from "@preact/signals";
import { render } from "preact";
import styled from "styled-components";

const Wrapper = styled.span`
	display: inline-flex;
	align-items: center;
	justify-content: flex-start;
	color: #efeff1;
	margin: 8px 0 8px 16px;
	font-size: 14px;
	font-weight: bold;
`;

function RealTimeComponent({ time }: { time: Signal<number> }) {
	return <Wrapper>{formatTime(time.value)}</Wrapper>;
}

const formatTime = (ms: number) => (ms < 0 ? "--:--:--" : new Date(ms).toLocaleTimeString("en-GB", { hour12: false }));

export default class RealVideoTimeModule extends KickModule {
	static URL_CONFIG = (url: string) => url.includes("/videos/") || url.includes("/");

	config: KickModuleConfig = {
		name: "real-video-time",
		appliers: [
			{
				type: "selector",
				key: "real-video-time",
				selectors: ["main"],
				callback: this.run.bind(this),
				validateUrl: RealVideoTimeModule.URL_CONFIG,
				once: true,
			},
		],
	};

	private realTime = signal(-1);
	private intervalId: number | null = null;
	private streamStatusCheckId: number | null = null;
	private videoCreatedAt: Date | null = null;
	private isVideoPage = false;

	private run() {
		if (document.querySelector(".enhancer-real-video-time")) return;

		this.isVideoPage = window.location.href.includes("/videos/");

		if (this.isVideoPage) {
			this.handleVideoPage();
		} else {
			this.handleStreamPage();
		}
	}

	private handleVideoPage() {
		const video = this.kickUtils().getVideoElement();
		if (!video) return this.logger.warn("Video element not found");

		const iso = this.kickUtils().getIsoDateProps();
		if (iso?.isoDate) this.videoCreatedAt = new Date(iso.isoDate);
		else if (!this.videoCreatedAt) return this.logger.warn("Video creation time not found");

		this.renderComponent();
		if (!this.intervalId) {
			this.intervalId = window.setInterval(() => this.updateRealTime(), 1000);
			this.updateRealTime();
		}
	}

	private handleStreamPage() {
		const streamStatus = this.kickUtils().getStreamStatusProps();
		if (!streamStatus || streamStatus.isLive) {
			document.querySelector(".enhancer-real-video-time")?.remove();
			if (this.intervalId) {
				clearInterval(this.intervalId);
				this.intervalId = null;
			}
			if (!this.streamStatusCheckId) {
				this.streamStatusCheckId = window.setInterval(() => this.checkStreamStatus(), 5000);
			}
			return;
		}

		if (this.streamStatusCheckId) {
			clearInterval(this.streamStatusCheckId);
			this.streamStatusCheckId = null;
		}

		const video = this.kickUtils().getVideoElement();
		if (!video) return this.logger.warn("Video element not found");

		this.renderComponent();
		if (!this.intervalId) {
			this.intervalId = window.setInterval(() => this.updateRealTime(), 1000);
			this.updateRealTime();
		}
	}

	private checkStreamStatus() {
		const streamStatus = this.kickUtils().getStreamStatusProps();
		if (streamStatus && !streamStatus.isLive) {
			this.handleStreamPage();
		} else if (streamStatus?.isLive) {
			document.querySelector(".enhancer-real-video-time")?.remove();
			if (this.intervalId) {
				clearInterval(this.intervalId);
				this.intervalId = null;
			}
		}
	}

	private renderComponent() {
		const video = this.kickUtils().getVideoElement();
		if (!video) return;
		const wrap = document.createElement("span");
		wrap.className = "enhancer-real-video-time";
		const sib =
			video.parentElement && Array.from(video.parentElement.children).find((e) => e !== video && e.tagName === "DIV");
		const inner = sib && Array.from(sib.children).find((e) => e.tagName === "DIV");

		if (inner) {
			inner.appendChild(wrap);
			if (this.realTime) render(<RealTimeComponent time={this.realTime} />, wrap);
			else this.logger.warn("Real time object not initialized");
		}
	}

	private updateRealTime() {
		const video = this.kickUtils().getVideoElement();
		if (!video) return;

		if (!this.isVideoPage) {
			const streamStatus = this.kickUtils().getStreamStatusProps();
			if (streamStatus?.isLive) {
				document.querySelector(".enhancer-real-video-time")?.remove();
				if (this.intervalId) {
					clearInterval(this.intervalId);
					this.intervalId = null;
				}
				return;
			}
		}

		if (!document.querySelector(".enhancer-real-video-time")) {
			this.renderComponent();
		}

		if (this.isVideoPage) {
			if (!this.videoCreatedAt) return;
			this.realTime.value = this.videoCreatedAt.getTime() + video.currentTime * 1000;
		} else {
			const videoProgress = this.kickUtils().getVideoProgressProps();
			if (!videoProgress) return;

			const currentTime = Date.now();
			const timeOffset = videoProgress.durationInMs - videoProgress.currentProgressInMs;
			this.realTime.value = currentTime - timeOffset;
		}
	}
}
