import type { Component } from "solid-js";
import styles from "./clip-download.module.css";

interface ClipDownloadComponentProps {
	click: () => void;
}

export const ClipDownloadComponent: Component<ClipDownloadComponentProps> = (
	props,
) => {
	return (
		<div class={styles.wrapper}>
			<button onClick={() => props.click()} type="button" class={styles.button}>
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
			</button>
		</div>
	);
};
