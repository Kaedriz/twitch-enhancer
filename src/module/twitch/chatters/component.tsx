import type { Component } from "solid-js";

interface ChattersComponentProps {
	count: number;
}

export const ChattersComponent: Component<ChattersComponentProps> = (props) => {
	return (
		<div>
			<span>—</span>
			<span>{props.count === -1 ? "???" : props.count}</span>
		</div>
	);
};
