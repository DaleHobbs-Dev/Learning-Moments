import { getLikesByPostId } from "./likes";

export const getAllPosts = async () => {
    const response = await fetch("http://localhost:8088/posts");
    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }
    return response.json();
};

export async function getPostsWithTopics() {
    const response = await fetch("http://localhost:8088/posts?_expand=topic");
    if (!response.ok) {
        throw new Error("Failed to fetch posts with topics");
    }
    const posts = await response.json();

    const postsWithLikes = await Promise.all(
        posts.map(async (post) => {
            const likes = await getLikesByPostId(post.id);
            return {
                ...post,
                likes: likes.length,
            };
        })
    );

    return postsWithLikes;
}