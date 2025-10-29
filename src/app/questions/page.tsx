'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  calculatePersonalityScore,
  determinePersonalityType,
  personalityTypes,
} from '@/lib/personalityScoring';
import {
  getPersonalityProfile,
  savePersonalityProfile,
  updatePersonalityResults,
} from '@/lib/storage';

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
      "Làm phần mình nhanh hơn hoặc hỗ trợ thêm để nhóm giữ nhịp.",
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
      "Vui và có cảm giác hứng khởi muốn bắt tay ngay vào đầu việc tiếp theo để giữ mức năng suất.",
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
      "Không mở mail, cuối tuần không làm việc.",
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
      "Không, mình làm việc có giới hạn.",
      "Rất thường, vì mình luôn muốn làm cho xong, hoàn thành thật tốt rồi hẵng nghỉ ngơi.",
      "Khá thường, vì khi vào guồng có hứng làm việc thì khó dừng."
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

const addLineBreaks = (text: string) => {
  if (text.length > 35) {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (testLine.length > 35) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine.trim());
    return (
      <>
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
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
    const updated = [...answers];
    updated[currentQuestion] = answerIndex;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    // ✅ Kiểm tra câu chưa trả lời
    const unansweredIndex = answers.findIndex((a) => a === null);
    if (unansweredIndex !== -1) {
      setCurrentQuestion(unansweredIndex);
      alert(`Bạn chưa trả lời câu ${unansweredIndex + 1}. Vui lòng trả lời tất cả câu trước khi nộp.`);
      return;
    }

    try {
      const numericAnswers = answers as number[];
      const score = calculatePersonalityScore(numericAnswers);
      const typeKey = determinePersonalityType(score);
      const typeData = personalityTypes[typeKey];

      // ✅ Lấy profile hiện tại từ localStorage
      const currentProfile = getPersonalityProfile();

      if (currentProfile) {
        // Cập nhật kết quả vào profile cũ
        updatePersonalityResults({
          ...currentProfile,
          answers: numericAnswers,
          score,
          typeKey,
          typeData,
          timestamp: Date.now(),
        });
      } else {
        // Nếu chưa có profile (trường hợp user vào thẳng link này)
        savePersonalityProfile({
          userName: 'Guest',
          answers: numericAnswers,
          score,
          typeKey,
          typeData,
          timestamp: Date.now(),
        });
      }

      // ✅ Điều hướng sang trang kết quả
      router.push('/result');
    } catch (err) {
      console.error('Lỗi khi tính điểm hoặc lưu localStorage:', err);
      alert('Có lỗi xảy ra khi lưu kết quả. Vui lòng thử lại.');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <img src="/images/hero/image 1.png" alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 w-full h-2 bg-gray-200">
        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="relative z-10 px-4 py-8 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div className="mb-6 md:mb-8 text-center">
          <img
            src={`/images/Questions/${currentQ.id}.png`}
            alt={`Question ${currentQ.id}`}
            className="mx-auto max-w-full h-auto"
            style={{ maxHeight: '300px' }}
          />
        </div>

        <div className="space-y-8 md:space-y-10 lg:space-y-12">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full pixel-option-button transition-all duration-200 ${answers[currentQuestion] === index ? 'selected-answer' : 'hover:opacity-90'
                }`}
            >
              <span
                className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium cautraloi-font ${answers[currentQuestion] === index ? 'text-orange-600 font-semibold' : 'text-black'
                  }`}
              >
                {addLineBreaks(option)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 md:mt-8 gap-3 md:gap-4">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="relative w-24 md:w-28 lg:w-32 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <img src="/images/hero/back.png" alt="Back button" className="w-full h-auto" />
            <span className="absolute inset-0 flex items-center justify-center text-black text-sm md:text-base lg:text-lg font-bold cauhoi-font">
              ← BACK
            </span>
          </button>

          <button
            onClick={handleNext}
            disabled={answers[currentQuestion] === null}
            className="relative w-24 md:w-28 lg:w-32 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <img src="/images/hero/go.png" alt="Next button" className="w-full h-auto" />
            <span className="absolute inset-0 flex items-center justify-center text-black text-sm md:text-base lg:text-lg font-bold cauhoi-font">
              {currentQuestion === questions.length - 1 ? 'SUBMIT →' : 'NEXT →'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
