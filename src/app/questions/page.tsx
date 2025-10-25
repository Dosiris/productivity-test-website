'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculatePersonalityScore, determinePersonalityType } from '@/lib/personalityScoring';

interface Question {
  id: number;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Nếu một ngày không có deadline, bạn sẽ....",
    options: [
      "Dành thời gian nghỉ ngơi thư giãn, nhưng vẫn sắp xếp nhẹ vài việc làm trước cho ngày sau.",
      "Vẫn tiếp tục làm việc khác hoặc lên kế hoạch mới, vì thấy không phí thời gian khi để một ngày trôi qua mà chưa làm được gì.",
      "Nghỉ ngơi hoàn toàn, thoải mái làm việc mình thích mà không phải lo nghĩ về công việc.",
      "Tìm việc này việc kia làm nhẹ nhàng, vì không làm gì cảm giác bứt rứt khó chịu."
    ]
  },
  {
    id: 2,
    question: "Bạn vừa làm việc liên tục 5 tiếng mà chưa ăn trưa. Công việc chưa hoàn thành nhưng cơ thể bắt đầu mệt mỏi, bạn sẽ....",
    options: [
      "Làm thêm chút nữa rồi nghỉ, dù hơi đói nhưng đang vào guồng năng suất, không muốn đứt mạch.",
      "Làm nốt phần dở rồi đi ăn, nghỉ ngơi xong quay lại làm tiếp để không bị kiệt sức.",
      "Quyết định tắt máy, ăn uống nghỉ ngơi để nạp lại năng lượng.",
      "Lờ luôn cơn đói, cố làm tiếp cho xong, vì dù gì cũng ăn không ngon nếu chưa xong công việc"
    ]
  },
  {
    id: 3,
    question: "Nếu đồng đội của bạn làm chậm tiến độ, bạn sẽ...",
    options: [
      "Làm phần mình nhanh hơn hoặc hỗ trợ thêm một chút để nhóm giữ nhịp.",
      "Đề nghị cùng hỗ trợ hoặc sắp xếp lại thời gian.",
      "Thường chủ động nhận thêm việc để đảm bảo kết quả đúng như kế hoạch ban đầu.",
      "Bình tĩnh, ai cũng có nhịp làm việc riêng."
    ]
  },
  {
    id: 4,
    question: "Khi hoàn thành một dự án lớn, cảm xúc của bạn thường là...",
    options: [
      "Hài lòng và tự thưởng cho bản thân vì đã nỗ lực.",
      "Vui và có cảm giác hứng khỏi muốn bắt tay ngay vào đầu việc tiếp theo để giữ mức năng suất.",
      "Cảm thấy vui vì đã hoàn thành, cuối cùng cũng được nghỉ ngơi.",
      "Cảm thấy nhẹ nhõm vì cuối cùng cũng đã hoàn thành, mong muốn làm tốt hơn ở lần sau."
    ]
  },
  {
    id: 5,
    question: "Khi được khen là \"rất năng suất\", bạn cảm thấy....",
    options: [
      "Hài lòng, thấy nỗ lực của mình được ghi nhận.",
      "Cũng vui nhưng cảm thấy hiển nhiên, tự nhủ phải cố gắng hơn để không làm người khác thất vọng về mình.",
      "Cảm thấy vui, nhưng mình cũng không đặt nặng chuyện đó.",
      "Có động lực để giữ đà làm việc như hiện tại, hài lòng về hình tượng năng suất mà bản thân tạo nên."
    ]
  },
  {
    id: 6,
    question: "Bạn đang tận hưởng ngày nghỉ cuối tuần thì có email công việc đến. Bạn sẽ....",
    options: [
      "Mở mail xem, nếu được thì làm luôn cho đỡ nặng đầu.",
      "không mở mail, cuối tuần không làm việc.",
      "Đọc mail rồi trả lời ngắn gọn rằng sẽ xử lý vào đầu tuần.",
      "Lập tức mở mail để xử lý ngay, sợ sẽ bỏ lỡ tình hình và muốn mình giữ tiến độ tốt nhất."
    ]
  },
  {
    id: 7,
    question: "Khi bắt đầu một ngày mới, bạn muốn bắt tay vào công việc bởi vì...",
    options: [
      "Vì mình sợ chậm tiến độ hoặc bị mọi người đánh giá là không được việc.",
      "Vì mình muốn hoàn thành tốt để có kết quả xứng đáng.",
      "Vì nếu rảnh rỗi không làm gì, mình sẽ cảm thấy bứt rứt, không quen.",
      "Vì mình hứng thú và thấy vui khi được làm."
    ]
  },
  {
    id: 8,
    question: "Khi thấy người khác vẫn đang làm việc trong khi bản thân mình đang nghỉ ngơi, bạn sẽ thấy...",
    options: [
      "Bình thường, mỗi người đều có một nhịp độ thời gian riêng.",
      "Không yên tâm nghỉ ngơi, cảm thấy áy náy và muốn quay lại làm việc để giữ phong độ.",
      "Cảm thông cho họ, nhưng vẫn nghỉ ngơi vì cần thiết để tiếp tục làm việc.",
      "Cảm thấy hơi bứt rứt, tìm vài việc nhẹ để làm cho đỡ phí thời gian."
    ]
  },
  {
    id: 9,
    question: "Khi mải đắm chìm vào công việc, bạn có thường quên ăn, quên giờ không?",
    options: [
      "Đôi khi, nếu đang hứng thú với dự án.",
      "không, mình làm việc có giới hạn.",
      "Rất thường, vì mình luôn muốn làm cho xong, hoàn thành thật tốt rồi hẵng nghỉ ngơi.",
      "khá thường, vì khi vào guồng có hứng làm việc thì khó dừng."
    ]
  },
  {
    id: 10,
    question: "Với bạn, \"làm việc năng suất\" có nghĩa là...",
    options: [
      "Làm việc có kế hoạch, tập trung vào chất lượng hơn số lượng.",
      "Làm hết mình trong khả năng, nhưng phải ưu tiên dành thời gian cho bản thân.",
      "Phải đạt được sự công nhận và tin tưởng về năng suất, không để bản thân mình bị chậm lại.",
      "Giữ nhịp làm việc đều đặn, cố gắng duy trì phong độ làm việc ở mức năng suất cao."
    ]
  }
];

// Function to add line breaks for better text balance
const addLineBreaks = (text: string) => {
  if (text.length > 50) {
    const words = text.split(' ');
    
    // Determine optimal number of lines based on text length
    let optimalLines = 2;
    if (text.length > 100) {
      optimalLines = 3;
    } else if (text.length > 150) {
      optimalLines = 4;
    }
    
    const targetLength = Math.floor(text.length / optimalLines);
    const breakPoints = [];
    
    // Find break points for optimal number of lines
    let currentIndex = 0;
    for (let line = 0; line < optimalLines - 1; line++) {
      let bestBreak = currentIndex + 1;
      let bestDiff = Infinity;
      
      // Look for the best break point for this line
      for (let i = currentIndex + 1; i < words.length - (optimalLines - line - 1); i++) {
        const lineText = words.slice(currentIndex, i).join(' ');
        const diff = Math.abs(lineText.length - targetLength);
        
        if (diff < bestDiff) {
          bestDiff = diff;
          bestBreak = i;
        }
      }
      
      breakPoints.push(bestBreak);
      currentIndex = bestBreak;
    }
    
    // Create the lines
    const lines = [];
    let startIndex = 0;
    
    for (let i = 0; i < breakPoints.length; i++) {
      lines.push(words.slice(startIndex, breakPoints[i]).join(' '));
      startIndex = breakPoints[i];
    }
    
    // Add the last line
    lines.push(words.slice(startIndex).join(' '));
    
    // Return the formatted text with line breaks
    return (
      <>
        {lines.map((line, index) => (
          <span key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </span>
        ))}
      </>
    );
  }
  return text;
};

export default function QuestionsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const router = useRouter();

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Tính điểm và chuyển đến trang kết quả
      const score = calculatePersonalityScore(answers.filter(a => a !== null) as number[]);
      const personalityType = determinePersonalityType(score);
      
      // Lưu kết quả vào localStorage
      localStorage.setItem('personalityResult', JSON.stringify({
        type: personalityType,
        score: score,
        answers: answers
      }));
      
      router.push('/result');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen relative">
      {/* Background với ảnh image 1 */}
      <div className="absolute inset-0">
        <img 
          src="/images/hero/image 1.png" 
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-full h-2 bg-gray-200">
        <div 
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question content */}
      <div className="relative z-10 px-4 py-8 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        {/* Question Image */}
        <div className="mb-6 md:mb-8 text-center">
          <img 
            src={`/images/Questions/${currentQ.id}.png`}
            alt={`Question ${currentQ.id}`}
            className="mx-auto max-w-full h-auto"
            style={{ maxHeight: '300px' }}
          />
        </div>

        {/* Answer options */}
        <div className="space-y-8 md:space-y-10 lg:space-y-12">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full pixel-option-button transition-all duration-200 ${
                answers[currentQuestion] === index
                  ? 'selected-answer'
                  : 'hover:opacity-90'
              }`}
              style={{ padding: 0 }}
            >
              <span className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium cautraloi-font ${
                answers[currentQuestion] === index
                  ? 'text-orange-600 font-semibold'
                  : 'text-black'
              }`}>
                {addLineBreaks(option)}
              </span>
            </button>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-6 md:mt-8 gap-3 md:gap-4">
          {/* Back button */}
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="relative w-24 md:w-28 lg:w-32 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <img 
              src="/images/hero/back.png" 
              alt="Back button"
              className="w-full h-auto"
            />
            <span className="absolute inset-0 flex items-center justify-center text-black text-sm md:text-base lg:text-lg font-bold cauhoi-font">
              ← BACK
            </span>
          </button>

          {/* Next/Submit button */}
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion] === null}
            className="relative w-24 md:w-28 lg:w-32 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <img 
              src="/images/hero/go.png" 
              alt="Next button"
              className="w-full h-auto"
            />
            <span className="absolute inset-0 flex items-center justify-center text-black text-sm md:text-base lg:text-lg font-bold cauhoi-font">
              {currentQuestion === questions.length - 1 ? 'SUBMIT →' : 'NEXT →'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
