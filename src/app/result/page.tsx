'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { personalityTypes, PersonalityType } from '@/lib/personalityScoring';

export default function ResultPage() {
  const router = useRouter();
  const [personalityType, setPersonalityType] = useState<PersonalityType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy kết quả từ localStorage
    const result = localStorage.getItem('personalityResult');
    if (result) {
      const { type } = JSON.parse(result);
      setPersonalityType(personalityTypes[type]);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF4C7' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (!personalityType) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFF4C7' }}>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy kết quả. Vui lòng làm lại bài test.</p>
          <button
            onClick={() => router.push('/test')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Làm lại bài test
          </button>
        </div>
      </div>
    );
  }

  const handleViewResults = () => {
    // Chuyển đến trang xem kết quả chi tiết
    router.push('/detailed-result');
  };

  const handleFullVersion = () => {
    // Chuyển đến trang bản full AI
    router.push('/full-version');
  };

  const handleRetakeTest = () => {
    // Làm lại bài test
    router.push('/test');
  };

  const handleBackToHome = () => {
    // Trở về trang home
    router.push('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF4C7' }}>

      {/* Main heading */}
      <div className="text-center pt-6 md:pt-8 pb-4 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 md:mb-8 pixel-text mx-auto">
          Kết quả
        </h1>
      </div>

      {/* Personality result */}
      <div className="w-full mb-6 md:mb-8 flex justify-center px-4">
        <img 
          src={personalityType.image} 
          alt={personalityType.name}
          className="h-auto block max-w-full"
        />
      </div>

      {/* Sub-heading */}
      <div className="text-center mb-8 md:mb-10 px-4">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-red-600 font-medium handwriting-font mx-auto">
          Khám phá thêm nhiều điều hay ho với bản nâng cao!
        </h2>
      </div>

      {/* Feature list */}
      <div className="max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-8 md:mb-10 px-4">
        <div className="space-y-4 md:space-y-6">
          {/* Feature 1 */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-black text-base md:text-lg lg:text-xl handwriting-font">
              Nhận được phân tích tính cách chi tiết từ AI.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-black text-base md:text-lg lg:text-xl handwriting-font">
              Hiểu rõ hơn về sự liên quan giữa tính cách và công việc.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-black text-base md:text-lg lg:text-xl handwriting-font">
              Nhận gợi ý nghề nghiệp phù hợp chuẩn xác.
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="text-center mb-6 px-4 space-y-4">
        <div>
          <button
            onClick={handleFullVersion}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 md:py-4 lg:py-5 px-6 md:px-8 lg:px-10 rounded-lg text-base md:text-lg lg:text-xl transition-colors duration-200 shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md"
          >
            Trải nghiệm bản full AI
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-2xl mx-auto">
          <button
            onClick={handleRetakeTest}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 md:py-4 lg:py-5 px-4 md:px-6 lg:px-8 rounded-lg text-sm md:text-base lg:text-lg transition-colors duration-200 shadow-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Làm lại bài test</span>
          </button>
          <button
            onClick={handleBackToHome}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 md:py-4 lg:py-5 px-4 md:px-6 lg:px-8 rounded-lg text-sm md:text-base lg:text-lg transition-colors duration-200 shadow-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Trở về trang home</span>
          </button>
        </div>
      </div>

      {/* Footer text */}
      <div className="text-center text-sm text-black px-4">
        <p>This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
      </div>
    </div>
  );
}
