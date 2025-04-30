export const ChattersQuery = `query GetChannelChattersCount($name: String!) {
        channel(name: $name) {
            chatters {
                count
            }
        }
    }`;

export const VideoCreatedAtQuery = `query GetVideoCreatedAt($id: ID!) {
    video(id: $id) {
        createdAt
    }
}`;
