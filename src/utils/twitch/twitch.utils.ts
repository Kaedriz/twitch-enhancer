import type { GQLResponse } from "types/utils/react";
import type {
	FollowedSection,
	MediaPlayerComponent,
	UserID,
} from "types/utils/twitch-react";
import ReactUtils from "utils/react/react.utils.ts";

export default class TwitchUtils extends ReactUtils {
	private readonly TWITCH_GQL_ENDPOINT = "https://gql.twitch.tv/gql";
	private readonly TWITCH_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";

	async gql<T>(query: string, variables: Record<string, string>) {
		return new Promise<GQLResponse<T>>((resolve, reject) =>
			fetch(this.TWITCH_GQL_ENDPOINT, {
				method: "POST",
				headers: {
					"Client-ID": this.TWITCH_CLIENT_ID,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query, variables }),
			})
				.then((response) => response.json())
				.then((response) => resolve(response))
				.catch((error) => reject(error)),
		);
	}

	getCurrentChannelByUrl() {
		let url = window.location.href;
		url = url.replace(/(^\w+:|^)\/\//, "");
		const elements = url.split("/");
		let name = elements[1];
		if (name === "popout" || elements[0].includes("dashboard"))
			name = elements[2];
		if (name.includes("?")) name = name.substring(0, name.indexOf("?"));
		return name.toLowerCase();
	}

	getUserIdBySideElement(element: Element): UserID | undefined {
		return this.findReactChildren<number>(
			this.getReactInstance(element),
			(n) => !!n.pendingProps?.userID,
			20,
		)?.pendingProps?.userID;
	}

	getMediaPlayerInstance() {
		return this.findReactChildren<MediaPlayerComponent>(
			this.getReactInstance(document.querySelector(".persistent-player")),
			(n) => !!n.stateNode?.props?.mediaPlayerInstance,
			20,
		)?.stateNode.props.mediaPlayerInstance;
	}

	getPersonalSections() {
		return this.findReactParents<FollowedSection>(
			this.getReactInstance(document.querySelector(".side-nav-section")),
			(n) => !!n.stateNode?.props?.section,
			1000,
		)?.stateNode.props;
	}
}
