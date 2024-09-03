import type { Component } from "solid-js";
import styles from "./pin-streamer.module.css";

interface PinStreamerComponentProps {
	isActivated: boolean;
}

export const PinStreamerComponent: Component<PinStreamerComponentProps> = (
	props,
) => {
	return (
		<div class={styles.wrapper}>
			<button type="button" class={styles.button}>
				{props.isActivated ? "★" : "☆"}
			</button>
		</div>
	);
};
