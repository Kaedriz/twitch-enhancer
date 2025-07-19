import { getApolloClient } from './twitch';

async function send(query, variables, options = {}) {
    const client = getApolloClient();
    if (!client) throw new Error('Failed to find Apollo Client');
    return client.query({ query, variables, ...options });
}

export default {
    async query(query, variables, auth) {
        return await send(query, variables, auth);
    },
};
