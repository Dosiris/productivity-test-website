'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { personalityTypes, PersonalityType } from '@/lib/personalityScoring';
import { getPersonalityProfile } from '@/lib/storage';

export default function ResultPage() {
  const router = useRouter();
  const [personalityType, setPersonalityType] = useState<PersonalityType | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const profile = getPersonalityProfile();

      if (profile) {
        const { userName, typeKey, typeData } = profile;

        // Ưu tiên typeData (đã lưu sẵn object), fallback qua personalityTypes[typeKey]
        const resolvedType =
          typeData && typeData.id
            ? typeData
            : typeKey
              ? personalityTypes[typeKey]
              : null;

        if (resolvedType) {
          setPersonalityType(resolvedType);
          setUserName(userName || '');
        } else {
          // Nếu không resolve được type thì quay lại test
          router.replace('/test');
        }
      } else {
        // Nếu chưa có profile thì về trang test
        router.replace('/test');
      }
    } catch (err) {
      console.error('Lỗi khi đọc profile:', err);
      router.replace('/test');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Loading
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

  // Không tìm thấy dữ liệu
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

  // Hàm điều hướng
  const handleFullVersion = () => router.push('/full-version');
  const handleRetakeTest = () => router.push('/test');
  const handleBackToHome = () => router.push('/');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF4C7' }}>
      {/* Tiêu đề */}
      <div className="text-center pt-6 md:pt-8 pb-4 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2 pixel-text">
          Kết quả của {userName || 'bạn'}
        </h1>
      </div>

      {/* Hình ảnh */}
      <div className="w-full mb-6 md:mb-8 flex justify-center px-4">
        <img
          src={personalityType.image}
          alt={personalityType.name}
          className="h-auto block max-w-full"
        />
      </div>

      {/* Nút hành động */}
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
            <span>Làm lại bài test</span>
          </button>
          <button
            onClick={handleBackToHome}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 md:py-4 lg:py-5 px-4 md:px-6 lg:px-8 rounded-lg text-sm md:text-base lg:text-lg transition-colors duration-200 shadow-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <span>Về trang chủ</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-black px-4 pb-4">
        <p>© 2025 Personality Test. All rights reserved.</p>
      </div>
    </div>
  );
}
