export const getAllTopics = async () => {
    const response = await fetch("http://localhost:8088/Topics");
    if (!response.ok) {
        throw new Error("Failed to fetch topics");
    }
    return response.json();
};

export const createTopic = async (topic) => {
    const response = await fetch("http://localhost:8088/Topics", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(topic),
    });
    if (!response.ok) {
        throw new Error("Failed to create new topic");
    }
    return response.json();
};