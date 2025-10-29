export async function POST(req: Request) {
    try {
        const { messages, profile } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: 'Invalid messages format' }),
                { status: 400 }
            );
        }

        // 🧠 Ghép thêm thông tin người dùng (nếu có)
        const userIntro = profile
            ? `Người dùng tên là ${profile.userName || 'bạn'}, có kiểu tính cách ${profile.type?.name || 'không rõ'}.
      Hãy điều chỉnh cách phản hồi sao cho phù hợp với kiểu tính cách này.`
            : 'Người dùng chưa cung cấp thông tin cá nhân hoặc kết quả bài test.';

        // 🧩 Prompt gốc được giữ nguyên — chỉ chèn userIntro vào
        const systemPrompt = `
Bạn là một trợ lý AI chỉ thảo luận về chủ đề "toxic productivity" — bao gồm: nhận diện, nguyên nhân, hậu quả, và cách vượt qua tình trạng này.
Nếu người dùng hỏi về chủ đề khác (như công nghệ, học tập, tin tức, hay lập trình), bạn KHÔNG trả lời, mà chỉ nhắc họ quay lại đúng chủ đề.
Ví dụ: "Mình chỉ có thể nói về toxic productivity thôi nha 🌿 Bạn có muốn mình giúp nhận diện dấu hiệu của nó không?"

${userIntro}
`;

        // 🚀 Gọi API OpenRouter
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'openai/gpt-4-turbo',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    ...messages.map((m: any) => ({
                        role: m.type === 'user' ? 'user' : 'assistant',
                        content: m.content,
                    })),
                ],
            }),
        });

        const data = await res.json();
        const reply =
            data?.choices?.[0]?.message?.content ||
            'Xin lỗi, mình chưa hiểu ý bạn 😅';

        return new Response(JSON.stringify({ response: reply }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('❌ OpenRouter API error:', error);
        return new Response(
            JSON.stringify({
                error: 'Lỗi khi gọi OpenRouter API',
                details: error.message,
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}