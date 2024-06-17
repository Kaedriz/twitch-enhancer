import CommonUtils from "./common-utils.ts";
import type { GQLResponse } from "./types.ts";

export default class TwitchUtil extends CommonUtils {
	private static readonly TWITCH_GQL_ENDPOINT = "https://gql.twitch.tv/gql";
	private static readonly TWITCH_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";

	getCurrentChannel() {
		return "igor_ovh";
	}

	async gql<T>(query: string, variables: Record<string, string>) {
		return new Promise<GQLResponse<T>>((resolve, reject) =>
			fetch(TwitchUtil.TWITCH_GQL_ENDPOINT, {
				method: "POST",
				headers: {
					"Client-ID": TwitchUtil.TWITCH_CLIENT_ID,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query, variables }),
			})
				.then((response) => response.json())
				.then((response) => resolve(response))
				.catch((error) => reject(error)),
		);
	}
}
