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

export const getLikesByUserId = async (userId) => {
    const response = await fetch(`http://localhost:8088/userPostLikes?userId=${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch likes for user");
    }
    return response.json();
}

export const getLikesExpandPostByUserId = async (userId) => {
    const response = await fetch(`http://localhost:8088/userPostLikes?userId=${userId}&_expand=post`);
    if (!response.ok) {
        throw new Error("Failed to fetch likes with expanded posts for user");
    }
    return response.json();
}

export const createLike = async (likeObject) => {
    const response = await fetch("http://localhost:8088/userPostLikes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(likeObject),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create like: ${response.status} ${errorText}`);
    }

    return response.json();
}

export const deleteLike = async (likeId) => {
    const response = await fetch(`http://localhost:8088/userPostLikes/${likeId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete like");
    }

    return response.json();
}
