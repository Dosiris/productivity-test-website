'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { personalityTypes, PersonalityType } from '@/lib/personalityScoring';

export default function ResultPage() {
  const router = useRouter();
  const [personalityType, setPersonalityType] = useState<PersonalityType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // đọc 3 key có thể có
      const resultRaw = localStorage.getItem('personalityResult'); // { type: 'overAchiever', score: {...}, answers: [...] }
      const fullRaw = localStorage.getItem('personalityFullData'); // optional full object
      const storedUserName = localStorage.getItem('userName'); // optional string

      // helper: chuyển typeKey (string) -> object personalityTypes[typeKey] nếu có
      const resolveTypeObject = (typeOrObj: any): PersonalityType | null => {
        if (!typeOrObj) return null;
        // nếu đã là object và có id/name -> coi là object đầy đủ
        if (typeof typeOrObj === 'object' && typeOrObj.id) {
          // đảm bảo id tồn trong personalityTypes, nếu có thì return chính bản trong personalityTypes để giữ consistency
          const id = typeOrObj.id;
          return personalityTypes[id] || typeOrObj;
        }
        // nếu là string -> lookup
        if (typeof typeOrObj === 'string') {
          return personalityTypes[typeOrObj] || null;
        }
        return null;
      };

      // parse nếu có
      const resultObj = resultRaw ? JSON.parse(resultRaw) : null;
      const fullObj = fullRaw ? JSON.parse(fullRaw) : null;

      // Quy tắc đồng bộ:
      // 1) Nếu có personalityResult (bắt buộc là trang result), lấy type từ đó (string) -> tìm object
      // 2) Nếu không có personalityResult nhưng có personalityFullData, dùng fullObj.type (object hoặc string)
      // 3) userName lấy từ key 'userName' ưu tiên, nếu không thì từ fullObj.userName (nếu có)

      const userName = storedUserName || (fullObj && (fullObj.userName || fullObj.name)) || '';

      let finalTypeObject: PersonalityType | null = null;

      if (resultObj && resultObj.type) {
        // resultObj.type kỳ vọng là key string (vd 'overAchiever')
        finalTypeObject = resolveTypeObject(resultObj.type);
      }

      if (!finalTypeObject && fullObj && fullObj.type) {
        // fullObj.type có thể là object hoặc string
        finalTypeObject = resolveTypeObject(fullObj.type);
      }

      // Nếu vẫn chưa có finalTypeObject, không vội lưu gì, xử lý sau
      if (finalTypeObject) {
        setPersonalityType(finalTypeObject);
      }

      // Build/merge một bản personalityFullData chuẩn (type là object)
      // Chỉ cập nhật localStorage nếu thiếu hoặc không đồng bộ
      const builtFullData = {
        userName: userName || '', // giữ chuỗi
        type: finalTypeObject || null, // object hoặc null
        score: resultObj?.score ?? (fullObj?.score ?? null),
        answers: resultObj?.answers ?? (fullObj?.answers ?? []),
        timestamp: (fullObj && fullObj.timestamp) || new Date().toISOString(),
      };

      // Decide whether to write back to localStorage:
      // - if no fullRaw exists -> write
      // - if fullRaw exists but type is string or missing -> replace with builtFullData
      // - if userName key exists separately but fullObj.userName differs -> sync
      let shouldWriteFull = false;

      if (!fullRaw) {
        shouldWriteFull = true;
      } else {
        // fullRaw exists: check if it is missing type object or userName mismatch
        const fullType = fullObj?.type;
        const fullUserName = fullObj?.userName ?? fullObj?.name ?? '';

        const fullTypeIsObject = typeof fullType === 'object' && fullType?.id;
        const finalTypeId = finalTypeObject?.id || null;

        if (!fullTypeIsObject && finalTypeId) {
          shouldWriteFull = true;
        } else if (finalTypeId && fullTypeIsObject && fullType?.id !== finalTypeId) {
          // mismatch type id -> update
          shouldWriteFull = true;
        } else if (fullUserName !== builtFullData.userName) {
          // sync username
          shouldWriteFull = true;
        }
      }

      if (shouldWriteFull) {
        // store full object (type is object)
        localStorage.setItem('personalityFullData', JSON.stringify(builtFullData));
      }

      // ALSO: ensure we have saved userName key separately (string) for other pages (like FullVersion)
      if (userName && localStorage.getItem('userName') !== userName) {
        localStorage.setItem('userName', userName);
      }

    } catch (err) {
      console.error('Lỗi khi xử lý localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Đang tải
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

  // Không có kết quả
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

  // Các hàm điều hướng
  const handleFullVersion = () => router.push('/full-version');
  const handleRetakeTest = () => router.push('/test');
  const handleBackToHome = () => router.push('/');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF4C7' } as React.CSSProperties}>
      {/* Tiêu đề */}
      <div className="text-center pt-6 md:pt-8 pb-4 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 md:mb-8 pixel-text mx-auto">
          Kết quả
        </h1>
      </div>

      {/* Hình ảnh kết quả */}
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

      {/* Footer */}
      <div className="text-center text-sm text-black px-4 pb-4">
        <p>This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
      </div>
    </div>
  );
}
