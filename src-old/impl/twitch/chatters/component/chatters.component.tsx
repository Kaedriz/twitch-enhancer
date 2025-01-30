import type { Component } from "solid-js";
import styles from "./chatters.module.css";

interface ChattersComponentProps {
	count: number;
	click: () => void;
}

export const ChattersComponent: Component<ChattersComponentProps> = (props) => {
	return (
		<span onClick={() => props.click()} class={styles.wrapper}>
			({props.count === -1 ? "Loading..." : props.count})
		</span>
	);
};
