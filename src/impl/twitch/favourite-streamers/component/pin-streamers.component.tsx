import type { Component } from "solid-js";
import styles from "./pin-streamers.module.css";

interface FavouriteStreamersComponentProps {
	isActivated: boolean;
}

export const PinStreamersComponent: Component<
	FavouriteStreamersComponentProps
> = (props) => {
	return (
		<div class={styles.container}>
			<button type="button" class={styles.favouriteStreamerButton}>
				{props.isActivated ? "★" : "☆"}
			</button>
		</div>
	);
};
