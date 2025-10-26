'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export default function FullVersionPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<{ userName: string; type: any } | null>(null);

  // 🔹 Khi load trang, đọc dữ liệu người dùng từ localStorage
  useEffect(() => {
    try {
      const storedFull = typeof window !== 'undefined' ? localStorage.getItem('personalityFullData') : null;
      const storedUserName = typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
      const full = storedFull ? JSON.parse(storedFull) : null;

      profileRef.current = {
        userName: storedUserName || full?.userName || full?.name || 'bạn',
        type: full?.type ?? null,
      };
    } catch (err) {
      profileRef.current = { userName: 'bạn', type: null };
      console.error('⚠️ Lỗi khi đọc profile từ localStorage:', err);
    }

    const firstMessage: Message = {
      id: 'welcome',
      type: 'ai',
      content: profileRef.current?.type
        ? `Xin chào ${profileRef.current.userName}! 👋 Mình là trợ lý AI giúp bạn cân bằng giữa công việc và nghỉ ngơi. Mình đã xem kết quả bài test của bạn rồi (${profileRef.current.type?.name || 'chưa rõ kiểu tính cách'}). Bạn có muốn mình tư vấn dựa trên kết quả đó không?`
        : `Xin chào ${profileRef.current?.userName || 'bạn'}! 👋 Mình là trợ lý AI giúp bạn cân bằng giữa công việc và nghỉ ngơi. Có vẻ như bạn chưa hoàn thành bài test tính cách — bạn muốn làm thử không?`,
      timestamp: new Date(),
    };

    setMessages([firstMessage]);
  }, []);

  // 🔹 Tự động cuộn khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🔹 Gửi tin nhắn
  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    const payloadMessages = [...messages, userMessage];
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const profile = profileRef.current || { userName: 'bạn', type: null };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages.map((m) => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
          profile,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const aiResponse = data?.response || 'Xin lỗi, mình chưa hiểu ý bạn 😅';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error('❌ Lỗi khi gửi tin nhắn:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: 'Lỗi khi kết nối tới máy chủ 😢',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200 sticky top-0 z-20">
        <button
          onClick={() => router.push('/result')}
          className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Quay lại</span>
        </button>

        <h1 className="text-base font-semibold text-gray-800">🌿 Productivity Assistant</h1>
        <div className="w-10" />
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-24">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.type === 'user'
                ? 'bg-green-500 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center text-xs text-gray-500 italic">AI đang gõ...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 flex items-center space-x-2 z-50">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          className="p-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
