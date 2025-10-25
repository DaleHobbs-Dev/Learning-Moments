export const getAllTopics = async () => {
    const response = await fetch("http://localhost:8088/Topics");
    if (!response.ok) {
        throw new Error("Failed to fetch topics");
    }
    return response.json();
};
