import type TwitchUtils from "$twitch/twitch.utils.ts";
import type { GQLResponse } from "$types/platforms/twitch/twitch.api.types.ts";
import type { ApolloClientFetchPolicy } from "$types/platforms/twitch/twitch.utils.types.ts";
import gql from "graphql-tag";

export default class TwitchApi {
	constructor(private readonly twitchUtils: TwitchUtils) {}

	async gql<T>(query: string, variables: Record<string, string>, fetchPolicy?: ApolloClientFetchPolicy) {
		const client = this.twitchUtils.getApolloClient();
		if (!client) throw new Error("Failed to find Apollo Client");
		return (await client.query({ query: gql`${query}`, variables, fetchPolicy })) as GQLResponse<T>;
	}
}
