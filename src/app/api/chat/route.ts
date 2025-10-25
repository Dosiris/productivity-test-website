export async function POST(req: Request) {
    try {
        const { messages, profile } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Invalid messages format' }), { status: 400 });
        }

        // --- Helper: normalize & sanitize name ---
        const normalizeName = (raw?: any) => {
            if (!raw) return '';
            // stringify, trim
            let s = String(raw).trim();

            // Replace multiple spaces with single
            s = s.replace(/\s+/g, ' ');

            // Keep letters (including Vietnamese range), spaces, dashes/apostrophe optional
            // Remove punctuation and digits
            s = s.replace(/[^a-zA-ZÀ-ỹà-ỹƠơƯưẠ-ỹạ-ỹ\s'-]/g, '');

            // Cut to reasonable length (e.g., 24 chars)
            if (s.length > 24) s = s.slice(0, 24).trim();

            return s;
        };

        // --- Simple profanity blacklist (demo) ---
        // Expand this list with real words you want to block/replace.
        const PROFANITY = [
            'mẹ kiếp', 'mịa', 'địt', 'đéo', 'đéo', 'fuck', 'shit', 'ngu', 'đồ ngu' // add more as needed
        ].map(w => w.toLowerCase());

        const containsProfanity = (name: string) => {
            const lower = name.toLowerCase();
            return PROFANITY.some(b => {
                // exact word or substring match (you can improve with word boundaries)
                return lower.includes(b);
            });
        };

        // Clean name from profile (try profile.userName first, fallback profile.name)
        const rawName = profile?.userName ?? profile?.name ?? '';
        const cleaned = normalizeName(rawName);

        const finalName = (cleaned && !containsProfanity(cleaned)) ? cleaned : 'bạn';

        // Build userIntro with safe name
        const userIntro = profile
            ? `Người dùng tên là ${finalName}, có kiểu tính cách ${profile.type?.name || 'không rõ'}.`
            : 'Người dùng chưa cung cấp thông tin cá nhân hoặc kết quả bài test.';

        const systemPrompt = `
Bạn là một trợ lý AI chỉ thảo luận về chủ đề "toxic productivity" — bao gồm: nhận diện, nguyên nhân, hậu quả, và cách vượt qua tình trạng này.
Nếu người dùng hỏi về chủ đề khác (như công nghệ, học tập, tin tức, hay lập trình), bạn KHÔNG trả lời, mà chỉ nhắc họ quay lại đúng chủ đề.
Ví dụ: "Mình chỉ có thể nói về toxic productivity thôi nha 🌿 Bạn có muốn mình giúp nhận diện dấu hiệu của nó không?"

${userIntro}
    `;

        // Build messages for OpenRouter in expected format
        const outMessages = [
            { role: 'system', content: systemPrompt },
            ...messages.map((m: any) => ({
                role: m.role ?? (m.type === 'user' ? 'user' : 'assistant'),
                content: m.content,
            })),
        ];

        // Call OpenRouter
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'openai/gpt-4-turbo',
                messages: outMessages,
            }),
        });

        const data = await res.json();
        const reply = data?.choices?.[0]?.message?.content || 'Xin lỗi, mình chưa hiểu ý bạn 😅';

        return new Response(JSON.stringify({ response: reply }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('❌ OpenRouter API error:', error);
        return new Response(JSON.stringify({ error: 'Lỗi khi gọi OpenRouter API', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
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
