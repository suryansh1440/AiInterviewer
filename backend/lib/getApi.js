export const getApi = () => {
    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.log("No OpenAI API key found in environment variables");
        return null;
    }
    return apiKey;
}
