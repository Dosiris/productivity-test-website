'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleNext = () => {
    if (name.trim()) {
      // Chuyển đến trang câu hỏi tiếp theo
      router.push('/questions');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Background với ảnh image 1 */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero/image 1.png" 
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto w-full">
        {/* Title */}
        <div className="mb-8 md:mb-10">
          <img 
            src="/images/hero/Layer 2 1.png" 
            alt="Productivity Test"
            className="h-auto mx-auto w-full max-w-md md:max-w-lg lg:max-w-xl"
          />
        </div>

        {/* Name Input */}
        <div className="mb-6 md:mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="NAME"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-12 md:h-14 bg-white border-4 border-black text-black text-center text-lg md:text-xl lg:text-2xl font-bold pixel-input"
            style={{ fontFamily: 'Courier New, monospace' }}
          />
        </div>

        {/* Next Button */}
        <div>
          <button
            onClick={handleNext}
            disabled={!name.trim()}
            className="w-32 md:w-40 lg:w-48 h-10 md:h-12 lg:h-14 bg-white border-4 border-black text-black text-center text-lg md:text-xl lg:text-2xl font-bold pixel-button-disabled hover:bg-gray-100 transition-colors duration-200"
            style={{ fontFamily: 'Courier New, monospace' }}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
