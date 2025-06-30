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
	static URL_CONFIG = (url: string) => url.includes("/videos/");

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
	private videoCreatedAt: Date | null = null;

	private run() {
		if (!RealVideoTimeModule.URL_CONFIG(window.location.href)) {
			document.querySelector(".enhancer-real-video-time")?.remove();
			return;
		}
		if (document.querySelector(".enhancer-real-video-time")) return;
		const video = this.kickUtils().getVideoElement();
		if (!video) return this.logger.warn("Video element not found");

		const iso = this.kickUtils().getIsoDateProps();
		if (iso?.isoDate) this.videoCreatedAt = new Date(iso.isoDate);
		else if (!this.videoCreatedAt) return this.logger.warn("Video creation time not found");

		const wrap = document.createElement("span");
		wrap.className = "enhancer-real-video-time";
		const sib =
			video.parentElement && Array.from(video.parentElement.children).find((e) => e !== video && e.tagName === "DIV");
		const inner = sib && Array.from(sib.children).find((e) => e.tagName === "DIV");

		if (inner) inner.appendChild(wrap);
		else return;
		render(<RealTimeComponent time={this.realTime} />, wrap);
		if (!this.intervalId) {
			this.intervalId = window.setInterval(() => this.updateRealTime(), 1000);
			this.updateRealTime();
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
			render(<RealTimeComponent time={this.realTime} />, wrap);
		}
	}

	private updateRealTime() {
		const video = this.kickUtils().getVideoElement();
		if (!video || !this.videoCreatedAt) return;
		if (!document.querySelector(".enhancer-real-video-time")) {
			this.renderComponent();
		}
		this.realTime.value = this.videoCreatedAt.getTime() + video.currentTime * 1000;
	}
}
