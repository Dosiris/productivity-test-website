'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartTest = () => {
    router.push('/test');
  };

  return (
    <div className="min-h-screen">
      {/* Header - Phần cam trên cùng */}
      <header className="bg-orange-500 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-white text-xl font-bold tracking-wide">
            Productivity Test
          </h1>
          <div className="ml-2 flex space-x-1">
            {/* Placeholder cho các ngôi sao */}
            <div className="w-3 h-3 bg-orange-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
        </div>
      </header>

      {/* Phần giữa - Ảnh hero full width */}
      <section className="w-full">
        <img 
          src="/images/hero/Khám phá GU.png" 
          alt="KHÁM PHÁ 'GU' NĂNG SUẤT của chính bạn"
          className="w-full h-auto block"
        />
      </section>

      {/* Phần dưới - Vàng kem với nội dung */}
      <section className="px-4 sm:px-6 py-8 sm:py-12" style={{ backgroundColor: '#FFF4C7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed">
            <p className="handwriting-font text-black">
              Bài trắc nghiệm nhanh này sẽ giúp bạn "chuẩn đoán" kiểu năng suất của bản thân!
            </p>
            
            <p className="handwriting-font text-black">
              Siêng năng là đức tính tốt, nhưng đừng để rơi vào "bẫy" năng suất độc hại, nơi bạn xoay như chong chóng trong căng thẳng, mệt mỏi mà hiệu quả thì mãi dậm chân tại chỗ.
            </p>
            
            <p className="handwriting-font text-black">
              Đừng lo, đây không phải bài kiểm tra năng lực hay đúng/sai. Bạn cứ trả lời thật tự nhiên theo thói quen làm việc của để khám phá kiểu năng suất thật sự của bạn nhé!
            </p>
          </div>
          
          {/* Button bắt đầu test */}
          <div className="text-center mt-8 sm:mt-12">
            <button 
              onClick={handleStartTest}
              className="bg-orange-500 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 text-lg sm:text-xl pixel-button"
            >
              BẮT ĐẦU TRẮC NGHIỆM
            </button>
          </div>
        </div>
      </section>

      {/* Ảnh bổ sung - Full width */}
      <section className="w-full">
        <img 
          src="/images/hero/4 kiểu năng suất.png" 
          alt="4 kiểu năng suất"
          className="w-full h-auto block"
        />
      </section>

      {/* Ảnh "Bạn thuộc kiểu năng suất nào" */}
      <section className="w-full">
        <img 
          src="/images/hero/Bạn thuộc kiểu năng suất nào.png" 
          alt="Bạn thuộc kiểu năng suất nào"
          className="w-full h-auto block"
        />
      </section>

      {/* Ảnh "Độc hại lành mạnh" */}
      <section className="w-full">
        <img 
          src="/images/hero/Độc hại lành mạnh.png" 
          alt="Độc hại lành mạnh"
          className="w-full h-auto block"
        />
      </section>

      {/* Phần text và nút START */}
      <section className="px-4 sm:px-6 py-8 sm:py-12" style={{ backgroundColor: '#FFF4C7' }}>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed">
            <p className="handwriting-font text-black">
              Năng suất độc hại sẽ làm mình đánh đồng giá trị bản thân qua thành tích, vắt kiệt chính mình bởi thói quen làm việc không ngừng, và thấy tội lỗi khi nghỉ ngơi.
            </p>
            
            <p className="handwriting-font text-black">
              Năng suất lành mạnh khi ta có thể làm việc hết mình, nghỉ ngơi thoải mái, hiểu rõ giới hạn và năng lượng bản thân để làm việc hiệu quả nhất mà vẫn đảm bảo về hiệu suất công việc.
            </p>
            
            <p className="handwriting-font text-black">
              Bí kíp từ chúng mình: Lắng nghe bản thân, biết điểm dừng và nhận ra rằng "đủ" đôi khi cũng là một sự hoàn hảo.
            </p>
          </div>
          
          {/* Nút START bằng hình ảnh */}
          <div className="text-center mt-8 sm:mt-12">
            <button 
              onClick={handleStartTest}
              className="bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity duration-200"
            >
              <img 
                src="/images/hero/start.png" 
                alt="START"
                className="h-auto mx-auto"
                style={{ maxHeight: '80px' }}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
