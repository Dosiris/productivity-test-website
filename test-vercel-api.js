// Test script để kiểm tra API trên Vercel
// Thay YOUR_VERCEL_URL bằng URL thực tế của bạn

const testVercelAPI = async () => {
    // Thay đổi URL này thành URL Vercel thực tế của bạn
    const vercelUrl = 'https://your-app-name.vercel.app'; // ← Thay đổi URL này!
    
    console.log('🧪 Testing Vercel API...');
    console.log('URL:', vercelUrl + '/api/chat');
    
    try {
        const response = await fetch(`${vercelUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: 'Xin chào, bạn có thể giúp tôi về toxic productivity không?'
                    }
                ],
                profile: {
                    userName: 'Test User',
                    type: { name: 'Test Type' }
                }
            })
        });

        console.log('📊 Response Status:', response.status);
        console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

        const data = await response.json();
        console.log('📊 Response Data:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('✅ API hoạt động bình thường trên Vercel!');
            console.log('🤖 AI Response:', data.response);
        } else {
            console.log('❌ API có lỗi:', data);
        }

    } catch (error) {
        console.error('❌ Lỗi khi test API:', error.message);
    }
};

// Chạy test
testVercelAPI();
