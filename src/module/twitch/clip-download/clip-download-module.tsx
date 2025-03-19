import Module from "module/core/module.ts";
import { type FunctionalComponent, h, render } from "preact";
import styled from "styled-components";
import type { ModuleConfig } from "types/module/module.types.ts";

export default class ClipDownloadModule extends Module {
	config: ModuleConfig = {
		name: "clip-download",
		appliers: [
			{
				type: "selector",
				key: "clip-download",
				selectors: [".player-controls__left-control-group"],
				callback: this.run.bind(this),
				validateUrl: (url) => {
					return url.includes("/clip/") || url.includes("clips.twitch.tv");
				},
				once: true,
			},
		],
	};

	private run(elements: Element[]) {
		const wrappers = this.utilsRepository.commonUtils.createEmptyElements(this.getId(), elements, "div");
		wrappers.forEach((element) => {
			render(<DownloadButtonComponent click={this.downloadClip.bind(this)} />, element);
		});
	}

	private downloadClip() {
		window.open(document.querySelector("video")?.src);
	}
}

interface DownloadButtonComponentProps {
	click: () => void;
}

const Wrapper = styled.div`
	color: #fff;
	margin: 0 0.25rem;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: var(--border-radius-medium);
	cursor: pointer;
	position: relative;

	&:hover {
		background-color: var(--color-background-button-icon-overlay-hover);
	}

`;

const DownloadButtonComponent: FunctionalComponent<DownloadButtonComponentProps> = ({ click }) => {
	return (
		<Wrapper onClick={click}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="20px"
				height="20px"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2.5"
					d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
				/>
			</svg>
		</Wrapper>
	);
};
