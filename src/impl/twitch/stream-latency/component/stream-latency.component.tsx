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
		<div class={styles.wrapper}>
			<span onClick={() => props.click()}>
				Latency: {formatLatency(props.latency)}
			</span>
		</div>
	);
};

const formatLatency = (latency: number) => {
	if (!latency || latency < 0) return "Loading...";
	return `${latency.toFixed(2)}s`;
};
