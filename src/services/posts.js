import { getAllTopics } from "./topics.js";

export const getAllPosts = async () => {
    const response = await fetch("http://localhost:8088/Posts");
    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }
    return response.json();
};

export async function getPostsWithTopics() {
    const [posts, topics] = await Promise.all([getAllPosts(), getAllTopics()]);
    return posts.map(post => ({
        ...post,
        topic: topics.find(t => t.id === post.topic_id),
        likesCount: post.likes?.length || 0,
    }));
}