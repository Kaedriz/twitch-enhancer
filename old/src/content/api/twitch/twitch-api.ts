import type Logger from "logger";
import type { GQLResponse } from "types/content/api/gql.types.ts";
import Api from "../api.ts";

export default class TwitchApi extends Api {
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
}
