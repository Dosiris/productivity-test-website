export async function POST(req: Request) {
    try {
        const { messages, profile } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: "Invalid messages format" }),
                { status: 400 }
            );
        }

        // 🧠 Thông tin người dùng (nếu có)
        const userIntro = profile
            ? `Người dùng tên là ${profile.userName || "bạn"}, có kiểu tính cách ${profile.type?.name || "không rõ"}.
Hãy phản hồi theo phong cách phù hợp với kiểu tính cách này.`
            : "Người dùng chưa cung cấp thông tin cá nhân hoặc kết quả bài test.";

        // 🌿 Prompt linh hoạt – không cứng nhắc, AI sẽ tự phát hiện và hướng lại chủ đề
        const systemPrompt = `
Bạn là một trợ lý AI thân thiện, chuyên về chủ đề "toxic productivity" — bao gồm: 
- Nhận diện dấu hiệu của toxic productivity,
- Nguyên nhân,
- Hậu quả,
- Và cách vượt qua.

Nếu người dùng nói điều không liên quan, đừng từ chối cứng nhắc. 
Hãy phản hồi tự nhiên, khéo léo hướng họ quay lại chủ đề toxic productivity. 
Ví dụ:
- "Hehe, câu này hơi lạc đề xíu 😅 Nhưng nếu bạn đang thấy điều đó ảnh hưởng tới năng suất hoặc áp lực của bạn, mình có thể giúp phân tích dưới góc độ toxic productivity nha 🌿"
- "Câu hỏi hay đó, nhưng mình tập trung nói về toxic productivity nhen, bạn có đang cảm thấy kiệt sức gần đây không?"

${userIntro}
`;

        // 🚀 Gọi API OpenRouter
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
                model: "openai/gpt-4-turbo",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    ...messages.map((m: any) => ({
                        role: m.type === "user" ? "user" : "assistant",
                        content: m.content,
                    })),
                ],
            }),
        });

        const data = await res.json();
        const reply =
            data?.choices?.[0]?.message?.content ||
            "Xin lỗi, mình chưa hiểu ý bạn 😅";

        return new Response(JSON.stringify({ response: reply }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("❌ OpenRouter API error:", error);
        return new Response(
            JSON.stringify({
                error: "Lỗi khi gọi OpenRouter API",
                details: error.message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}
