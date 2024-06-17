import type { Component } from "solid-js";
import styles from "./chatters.module.css";

interface ChattersComponentProps {
	count: number;
}

export const ChattersComponent: Component<ChattersComponentProps> = (props) => {
	return (
		<div class={styles.wrapper}>
			<span>·</span>
			<span>{props.count === -1 ? "???" : props.count}</span>
		</div>
	);
};
