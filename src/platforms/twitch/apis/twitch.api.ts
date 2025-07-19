import type TwitchUtils from "$twitch/twitch.utils.ts";
import type { GQLResponse } from "$types/platforms/twitch/twitch.api.types.ts";
import gql from "graphql-tag";

export default class TwitchApi {
	constructor(private readonly twitchUtils: TwitchUtils) {}

	async gql<T>(query: string, variables: Record<string, string>) {
		const client = this.twitchUtils.getApolloClient();
		if (!client) throw new Error("Failed to find Apollo Client");
		return (await client.query({ query: gql`${query}`, variables })) as GQLResponse<T>;
	}
}
