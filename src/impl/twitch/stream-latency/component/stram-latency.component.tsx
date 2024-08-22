import type { Component } from "solid-js";
import styles from "./stream-latency.module.css";

interface StreamLatencyComponentProps {
	latency: number;
	click: () => void;
}

export const StreamLatencyComponent: Component<StreamLatencyComponentProps> = (
	props,
) => {
	return (
		<div class={styles.latencyContainer}>
			<span onClick={() => props.click()} class={styles.wrapper}>
				Delay: {props.latency > 0 ? props.latency : "Loading..."}
			</span>
			<p class={styles.seconds}> s</p>
		</div>
	);
};
