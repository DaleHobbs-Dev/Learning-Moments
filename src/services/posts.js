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

export async function getPostsWithTopicsLikesUsers() {
    const response = await fetch("http://localhost:8088/posts?_expand=topic&_expand=user");
    if (!response.ok) {
        throw new Error("Failed to fetch posts with topics and user");
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

export async function getPostsWithTopicsLikesUsersByPostID(postId) {
    try {
        const res = await fetch(
            `http://localhost:8088/posts/${postId}?_expand=topic&_expand=user`
        );
        if (!res.ok) throw new Error("Failed to fetch post");

        const post = await res.json();
        const likes = await getLikesByPostId(post.id);

        return { ...post, likes: likes.length, likesList: likes };
    } catch (error) {
        console.error("Error fetching post details:", error);
        throw error;
    }
}