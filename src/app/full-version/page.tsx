'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  options?: string[];
}

export default function FullVersionPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Chào mừng bạn đến với bản nâng cao. Xem ngay phân tích nghề nghiệp bằng AI dành riêng cho bạn!',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'ai',
      content: 'Trước tiên hãy giới thiệu một chút về bản thân nhé. Công việc của bạn là...',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Hàm tính toán kết quả dựa trên câu trả lời
  const calculatePersonalityFromAnswers = () => {
    if (answers.length < 2) return 'balancer'; // Default fallback
    
    const [answer1, answer2] = answers;
    
    // Logic tính điểm dựa trên 2 câu hỏi
    let scores = { busyBee: 0, chiller: 0, balancer: 0, overAchiever: 0 };
    
    // Câu hỏi 1: Xử lý deadline
    switch (answer1) {
      case 0: scores.busyBee += 3; break;      // Làm việc liên tục
      case 1: scores.balancer += 3; break;     // Lập kế hoạch chi tiết
      case 2: scores.overAchiever += 3; break; // Ủy thác công việc
      case 3: scores.chiller += 3; break;      // Làm việc bình thường
    }
    
    // Câu hỏi 2: Cảm thấy hài lòng
    switch (answer2) {
      case 0: scores.busyBee += 2; break;      // Hoàn thành nhiều việc
      case 1: scores.overAchiever += 2; break; // Đạt mục tiêu lớn
      case 2: scores.chiller += 2; break;      // Có thời gian nghỉ ngơi
      case 3: scores.balancer += 2; break;     // Cân bằng cuộc sống
    }
    
    // Tìm kiểu có điểm cao nhất
    const maxScore = Math.max(...Object.values(scores));
    const result = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore);
    
    return result || 'balancer';
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, currentStep);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        options: aiResponse.options
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setCurrentStep(aiResponse.nextStep);
    }, 1500);
  };

  const handleOptionClick = (option: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: option,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Lưu câu trả lời nếu là câu hỏi 1 hoặc 2
    if (currentStep === 2 || currentStep === 3) {
      // Tìm index của option trong danh sách options hiện tại
      const currentMessage = messages[messages.length - 1];
      const optionIndex = currentMessage.options?.indexOf(option) || 0;
      setAnswers(prev => [...prev, optionIndex]);
    }

    setTimeout(() => {
      const aiResponse = generateAIResponse(option, currentStep);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        options: aiResponse.options
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setCurrentStep(aiResponse.nextStep);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, step: number): { content: string; options?: string[]; nextStep: number } => {
    const input = userInput.toLowerCase();
    
    if (step === 0) {
      // Nhận diện các nghề IT
      if (input.includes('lập trình') || input.includes('developer') || input.includes('programmer') || input.includes('coder')) {
        return {
          content: 'Ý bạn là:',
          options: ['Back-end Engineer', 'Front-end Engineer', 'Full Stack Development'],
          nextStep: 1
        };
      }
      
      // Nhận diện freelancer
      if (input.includes('freelancer') || input.includes('freelance') || input.includes('tự do')) {
        return {
          content: 'Bạn làm freelancer trong lĩnh vực nào?',
          options: ['Design & Creative', 'Writing & Content', 'Marketing & Sales', 'IT & Development', 'Consulting', 'Other'],
          nextStep: 1
        };
      }
      
      // Nhận diện giáo viên
      if (input.includes('giáo viên') || input.includes('teacher') || input.includes('giảng viên') || input.includes('instructor')) {
        return {
          content: 'Bạn dạy môn gì?',
          options: ['Khoa học tự nhiên', 'Khoa học xã hội', 'Ngoại ngữ', 'Nghệ thuật', 'Thể thao', 'Kỹ thuật & Công nghệ'],
          nextStep: 1
        };
      }
      
      // Nhận diện ca sĩ/nghệ sĩ
      if (input.includes('ca sĩ') || input.includes('singer') || input.includes('nghệ sĩ') || input.includes('artist') || input.includes('nhạc sĩ') || input.includes('musician')) {
        return {
          content: 'Bạn hoạt động trong lĩnh vực âm nhạc nào?',
          options: ['Ca sĩ', 'Nhạc sĩ', 'Producer', 'DJ', 'Biểu diễn', 'Sáng tác', 'Other'],
          nextStep: 1
        };
      }
      
      // Nhận diện kinh doanh
      if (input.includes('kinh doanh') || input.includes('business') || input.includes('marketing') || input.includes('sales') || input.includes('bán hàng') || input.includes('thương mại')) {
        return {
          content: 'Bạn làm trong lĩnh vực kinh doanh nào?',
          options: ['Marketing', 'Sales', 'Quản lý', 'Tài chính', 'Nhân sự', 'Khởi nghiệp', 'Other'],
          nextStep: 1
        };
      }
      
      // Nhận diện y tế
      if (input.includes('bác sĩ') || input.includes('doctor') || input.includes('y tá') || input.includes('nurse') || input.includes('dược sĩ') || input.includes('pharmacist')) {
        return {
          content: 'Bạn làm trong lĩnh vực y tế nào?',
          options: ['Bác sĩ đa khoa', 'Bác sĩ chuyên khoa', 'Y tá', 'Dược sĩ', 'Kỹ thuật viên y tế', 'Other'],
          nextStep: 1
        };
      }
      
      // Nhận diện kỹ sư
      if (input.includes('kỹ sư') || input.includes('engineer') || input.includes('kỹ thuật') || input.includes('technical')) {
        return {
          content: 'Bạn làm kỹ sư trong lĩnh vực nào?',
          options: ['Cơ khí', 'Điện tử', 'Xây dựng', 'Hóa học', 'Môi trường', 'IT/Software', 'Other'],
          nextStep: 1
        };
      }
      
      // Nhận diện luật sư
      if (input.includes('luật sư') || input.includes('lawyer') || input.includes('pháp lý') || input.includes('legal')) {
        return {
          content: 'Bạn làm trong lĩnh vực pháp lý nào?',
          options: ['Luật sư tư vấn', 'Luật sư tranh tụng', 'Công chứng', 'Thẩm phán', 'Kiểm sát viên', 'Other'],
          nextStep: 1
        };
      }
      
      // Nhận diện tài chính
      if (input.includes('tài chính') || input.includes('finance') || input.includes('ngân hàng') || input.includes('banking') || input.includes('kế toán') || input.includes('accountant')) {
        return {
          content: 'Bạn làm trong lĩnh vực tài chính nào?',
          options: ['Ngân hàng', 'Đầu tư', 'Bảo hiểm', 'Kế toán', 'Kiểm toán', 'Tư vấn tài chính', 'Other'],
          nextStep: 1
        };
      }
      
      // Nhận diện thiết kế
      if (input.includes('thiết kế') || input.includes('design') || input.includes('designer') || input.includes('họa sĩ') || input.includes('artist')) {
        return {
          content: 'Bạn làm thiết kế trong lĩnh vực nào?',
          options: ['Graphic Design', 'UI/UX Design', 'Fashion Design', 'Interior Design', 'Web Design', 'Other'],
          nextStep: 1
        };
      }
      
      // Nhận diện bán hàng
      if (input.includes('bán hàng') || input.includes('sales') || input.includes('nhân viên bán hàng') || input.includes('tư vấn')) {
        return {
          content: 'Bạn bán hàng trong lĩnh vực nào?',
          options: ['Bán lẻ', 'Bán buôn', 'Bất động sản', 'Ô tô', 'Bảo hiểm', 'Tài chính', 'Other'],
          nextStep: 1
        };
      }
      
      // Nhận diện văn phòng
      if (input.includes('văn phòng') || input.includes('office') || input.includes('hành chính') || input.includes('admin') || input.includes('thư ký') || input.includes('secretary')) {
        return {
          content: 'Bạn làm công việc văn phòng nào?',
          options: ['Hành chính', 'Thư ký', 'Quản lý văn phòng', 'Nhân sự', 'Kế toán', 'Other'],
          nextStep: 1
        };
      }
      
      // Nhận diện dịch vụ
      if (input.includes('dịch vụ') || input.includes('service') || input.includes('phục vụ') || input.includes('nhà hàng') || input.includes('khách sạn')) {
        return {
          content: 'Bạn làm trong lĩnh vực dịch vụ nào?',
          options: ['Nhà hàng', 'Khách sạn', 'Du lịch', 'Spa & Wellness', 'Vận chuyển', 'Other'],
          nextStep: 1
        };
      }
      
      // Nếu không nhận diện được nghề cụ thể - fallback thông minh
      return {
        content: 'Oh cảm ơn! Bạn đã có bao nhiêu năm kinh nghiệm trong công việc này?',
        options: ['1-2 năm', '3-5 năm', '5+ năm'],
        nextStep: 2
      };
    }
    
    if (step === 1) {
      // Kiểm tra xem có phải là lựa chọn nghề nghiệp không
      const jobOptions = [
        // IT
        'Back-end Engineer', 'Front-end Engineer', 'Full Stack Development',
        // Freelancer
        'Design & Creative', 'Writing & Content', 'Marketing & Sales', 'IT & Development', 'Consulting', 'Other',
        // Giáo viên
        'Khoa học tự nhiên', 'Khoa học xã hội', 'Ngoại ngữ', 'Nghệ thuật', 'Thể thao', 'Kỹ thuật & Công nghệ',
        // Ca sĩ/Nghệ sĩ
        'Ca sĩ', 'Nhạc sĩ', 'Producer', 'DJ', 'Biểu diễn', 'Sáng tác',
        // Kinh doanh
        'Marketing', 'Sales', 'Quản lý', 'Tài chính', 'Nhân sự', 'Khởi nghiệp',
        // Y tế
        'Bác sĩ đa khoa', 'Bác sĩ chuyên khoa', 'Y tá', 'Dược sĩ', 'Kỹ thuật viên y tế',
        // Kỹ sư
        'Cơ khí', 'Điện tử', 'Xây dựng', 'Hóa học', 'Môi trường', 'IT/Software',
        // Luật sư
        'Luật sư tư vấn', 'Luật sư tranh tụng', 'Công chứng', 'Thẩm phán', 'Kiểm sát viên',
        // Tài chính
        'Ngân hàng', 'Đầu tư', 'Bảo hiểm', 'Kế toán', 'Kiểm toán', 'Tư vấn tài chính',
        // Thiết kế
        'Graphic Design', 'UI/UX Design', 'Fashion Design', 'Interior Design', 'Web Design',
        // Bán hàng
        'Bán lẻ', 'Bán buôn', 'Bất động sản', 'Ô tô', 'Bảo hiểm',
        // Văn phòng
        'Hành chính', 'Thư ký', 'Quản lý văn phòng',
        // Dịch vụ
        'Nhà hàng', 'Khách sạn', 'Du lịch', 'Spa & Wellness', 'Vận chuyển'
      ];
      
      if (jobOptions.some(option => input.includes(option.toLowerCase()))) {
        return {
          content: 'Bạn đã có bao nhiêu năm kinh nghiệm?',
          options: ['1-2 năm', '3-5 năm', '5+ năm'],
          nextStep: 2
        };
      }
      
      // Nếu không phải lựa chọn nghề nghiệp, tiếp tục hỏi kinh nghiệm
      return {
        content: 'Bạn đã có bao nhiêu năm kinh nghiệm?',
        options: ['1-2 năm', '3-5 năm', '5+ năm'],
        nextStep: 2
      };
    }
    
    if (step === 2) {
      return {
        content: 'Cảm ơn bạn đã chia sẻ. Bắt đầu thôi!\n\n**Câu hỏi cho bạn #1**\n\nKhi có deadline gấp, bạn thường xử lý như thế nào?',
        options: [
          'Làm việc liên tục không nghỉ cho đến khi hoàn thành',
          'Lập kế hoạch chi tiết và làm từng bước một cách có tổ chức',
          'Tìm cách ủy thác công việc cho người khác',
          'Làm việc bình thường, không để deadline ảnh hưởng đến chất lượng'
        ],
        nextStep: 3
      };
    }
    
    if (step === 3) {
      return {
        content: '**Productive AI**\n\n**Câu hỏi cho bạn #2**\n\nBạn cảm thấy hài lòng nhất khi nào?',
        options: [
          'Khi hoàn thành nhiều việc trong một ngày',
          'Khi đạt được mục tiêu lớn và có ý nghĩa',
          'Khi có thời gian nghỉ ngơi và thư giãn',
          'Khi cân bằng tốt giữa công việc và cuộc sống'
        ],
        nextStep: 4
      };
    }
    
    if (step === 4) {
      // Tính toán kết quả dựa trên câu trả lời
      const personalityResult = calculatePersonalityFromAnswers();
      
      // Lưu kết quả vào localStorage
      localStorage.setItem('personalityResult', JSON.stringify({
        type: personalityResult,
        timestamp: new Date().toISOString()
      }));
      
      return {
        content: '**Productive AI**\n\nKết quả',
        options: ['Xem kết quả ngay'],
        nextStep: 5
      };
    }
    
    if (step === 5) {
      // Chuyển về trang result
      router.push('/result');
      return {
        content: 'Đang chuyển đến trang kết quả...',
        nextStep: 6
      };
    }
    
    return {
      content: 'Cảm ơn bạn đã chia sẻ. Hãy cho tôi biết thêm về bản thân nhé!',
      nextStep: step
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToResult = () => {
    router.push('/result');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Productive AI</h1>
          <button
            onClick={handleBackToResult}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat container */}
      <div className="relative z-10 max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-green-100 border border-green-200 text-gray-800'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-gray-500' : 'text-gray-300'
                  }`}>
                    {message.timestamp.toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
              
              {/* Options */}
              {message.options && message.type === 'ai' && (
                <div className="mt-3 space-y-2">
                  {message.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className="block w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-white px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập văn bản"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}