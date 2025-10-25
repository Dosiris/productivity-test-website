'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { personalityTypes, PersonalityType } from '@/lib/personalityScoring';

export default function DetailedResultPage() {
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

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleRetakeTest = () => {
    router.push('/test');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF4C7' }}>
      {/* Personality Image (full width, no white background) */}
      <div className="w-full flex justify-center px-4">
        <img
          src={personalityType.image}
          alt={personalityType.name}
          className="h-auto block max-w-full"
        />
      </div>

      {/* Back to Home button */}
      <div className="text-center mt-8 mb-8 px-8">
        <button
          onClick={handleBackToHome}
          className="px-8 py-4 font-bold text-lg sm:text-xl pixel-button bg-orange-500 text-white"
        >
          ← Về Trang Chủ
        </button>
      </div>
    </div>
  );
}
