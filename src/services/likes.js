export const getLikes = () => {
    const response = fetch(`http://localhost:8088/userPostLikes`).then(res => {
        if (!res.ok) {
            throw new Error("Failed to fetch likes");
        }
        return res.json();
    });
    return response;
}

export const getLikesByPostId = async (postId) => {
    const response = await fetch(`http://localhost:8088/userPostLikes?postId=${postId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch likes for post");
    }
    return response.json();
}