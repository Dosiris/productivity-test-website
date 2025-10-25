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
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
            <img 
              src="/images/hero/Name.png" 
              alt="Name input frame"
              className="w-full h-auto"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="NAME"
              className="absolute inset-0 w-full h-full bg-transparent text-black text-center text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold cauhoi-font placeholder-gray-500"
              style={{ 
                padding: '12px 20px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Next Button */}
        <div>
          <button
            onClick={handleNext}
            disabled={!name.trim()}
            className="relative w-32 md:w-40 lg:w-48 mx-auto block transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <img 
              src="/images/hero/Next.png" 
              alt="Next button"
              className="w-full h-auto"
            />
            <span className="absolute inset-0 flex items-center justify-center text-black text-lg md:text-xl lg:text-2xl font-bold cauhoi-font">
              NEXT
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
