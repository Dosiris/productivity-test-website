let currentKeyIndex = 0;

export function getNextApiKey() {
    const keys = Object.entries(process.env)
        .filter(([key]) => key.startsWith("OPENROUTER_API_KEY"))
        .map(([_, value]) => value)
        .filter(Boolean);

    if (keys.length === 0) {
        throw new Error("❌ Không tìm thấy API key trong .env");
    }

    const key = keys[currentKeyIndex % keys.length];
    currentKeyIndex = (currentKeyIndex + 1) % keys.length;

    return key;
}
