export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: 'Invalid messages format' }),
                { status: 400 }
            );
        }

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
                        content: `
              Bạn là trợ lý AI thân thiện, chuyên hỗ trợ người dùng trong lĩnh vực "toxic productivity".
              Hãy giúp họ cân bằng giữa công việc và nghỉ ngơi, nhẹ nhàng như một người bạn.
              Nếu người dùng hỏi ngoài chủ đề, hãy khéo léo hướng họ quay lại.
            `,
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
