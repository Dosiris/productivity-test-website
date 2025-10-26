export interface PersonalityScore {
  busyBee: number;
  chiller: number;
  balancer: number;
  overAchiever: number;
}

export interface PersonalityType {
  id: string;
  name: string;
  vietnameseName: string;
  description: string;
  strengths: string[];
  careerSuggestions: string[];
  tips: string;
  color: string;
  emoji: string;
  image: string;
}

// Định nghĩa 4 kiểu tính cách
export const personalityTypes: Record<string, PersonalityType> = {
  busyBee: {
    id: 'busyBee',
    name: 'Busy Bee',
    vietnameseName: 'Người Bận Rộn',
    description: 'Bạn là người luôn bận rộn và không ngừng nỗ lực. Bạn có xu hướng làm nhiều việc cùng lúc và cảm thấy khó chịu khi không có gì để làm.',
    strengths: [
      'Năng động và nhiệt huyết',
      'Có khả năng đa nhiệm tốt',
      'Luôn sẵn sàng giúp đỡ người khác',
      'Có động lực cao'
    ],
    careerSuggestions: [
      'Quản lý dự án',
      'Event planning',
      'Sales & Marketing',
      'Khởi nghiệp'
    ],
    tips: 'Hãy học cách ưu tiên và tập trung vào những việc quan trọng nhất. Đừng quên dành thời gian nghỉ ngơi để tránh kiệt sức.',
    color: '#F59E0B',
    emoji: '🐝',
    image: '/images/hero/Busy-bee.png'
  },
  chiller: {
    id: 'chiller',
    name: 'The Chiller',
    vietnameseName: 'Người Thư Giãn',
    description: 'Bạn là người biết cách cân bằng giữa công việc và cuộc sống. Bạn ưu tiên sức khỏe tinh thần và không để công việc chi phối hoàn toàn.',
    strengths: [
      'Biết cách thư giãn',
      'Cân bằng tốt giữa công việc và cuộc sống',
      'Không bị stress quá mức',
      'Có khả năng tận hưởng cuộc sống'
    ],
    careerSuggestions: [
      'Freelancer',
      'Nghệ thuật & Sáng tạo',
      'Tư vấn',
      'Giáo dục'
    ],
    tips: 'Hãy tận dụng khả năng cân bằng của mình để tạo ra môi trường làm việc tích cực cho bản thân và đồng nghiệp.',
    color: '#10B981',
    emoji: '🧘',
    image: '/images/hero/Chiller.png'
  },
  balancer: {
    id: 'balancer',
    name: 'The Balancer',
    vietnameseName: 'Người Cân Bằng',
    description: 'Bạn là người biết cách cân bằng giữa năng suất và sức khỏe. Bạn làm việc hiệu quả nhưng cũng biết khi nào cần nghỉ ngơi.',
    strengths: [
      'Cân bằng tốt giữa năng suất và sức khỏe',
      'Có kỹ năng quản lý thời gian',
      'Biết cách ưu tiên công việc',
      'Có khả năng thích ứng cao'
    ],
    careerSuggestions: [
      'Quản lý nhân sự',
      'Tư vấn doanh nghiệp',
      'Phát triển sản phẩm',
      'Đào tạo & Phát triển'
    ],
    tips: 'Hãy chia sẻ kinh nghiệm cân bằng của mình với đồng nghiệp để tạo ra môi trường làm việc lành mạnh hơn.',
    color: '#3B82F6',
    emoji: '⚖️',
    image: '/images/hero/Balancer.png'
  },
  overAchiever: {
    id: 'overAchiever',
    name: 'Over Achiever',
    vietnameseName: 'Người Thành Tích',
    description: 'Bạn là người luôn đặt mục tiêu cao và không ngừng phấn đấu để đạt được chúng. Bạn có thể làm việc quá sức để đạt được kết quả tốt nhất.',
    strengths: [
      'Có mục tiêu rõ ràng',
      'Làm việc hiệu quả cao',
      'Chịu được áp lực',
      'Có động lực mạnh mẽ'
    ],
    careerSuggestions: [
      'Lãnh đạo cấp cao',
      'Tư vấn chiến lược',
      'Đầu tư & Tài chính',
      'Nghiên cứu & Phát triển'
    ],
    tips: 'Hãy nhớ rằng thành công không chỉ là kết quả cuối cùng mà còn là quá trình. Đừng quá khắt khe với bản thân.',
    color: '#EF4444',
    emoji: '🎯',
    image: '/images/hero/Over achiever.png'
  }
};

// Hệ thống tính điểm dựa trên câu trả lời
export function calculatePersonalityScore(answers: number[]): PersonalityScore {
  const score: PersonalityScore = {
    busyBee: 0,
    chiller: 0,
    balancer: 0,
    overAchiever: 0
  };

  // Logic tính điểm cho từng câu hỏi theo bảng mới
  answers.forEach((answer, questionIndex) => {
    switch (questionIndex) {
      case 0: // Câu 1
        if (answer === 0) score.balancer += 4;
        if (answer === 1) score.overAchiever += 4;
        if (answer === 2) score.chiller += 4;
        if (answer === 3) score.busyBee += 4;
        break;

      case 1: // Câu 2
        if (answer === 0) score.overAchiever += 4;
        if (answer === 1) score.chiller += 4;
        if (answer === 2) score.busyBee += 4;
        if (answer === 3) score.balancer += 4;
        break;

      case 2: // Câu 3
        if (answer === 0) score.busyBee += 2;
        if (answer === 1) score.balancer += 4;
        if (answer === 2) score.overAchiever += 4;
        if (answer === 3) score.chiller += 2;
        break;

      case 3: // Câu 4
        if (answer === 0) score.balancer += 2;
        if (answer === 1) score.overAchiever += 4;
        if (answer === 2) score.chiller += 4;
        if (answer === 3) score.busyBee += 2;
        break;

      case 4: // Câu 5
        if (answer === 0) score.balancer += 4;
        if (answer === 1) score.overAchiever += 1;
        if (answer === 2) score.chiller += 4;
        if (answer === 3) score.busyBee += 1;
        break;

      case 5: // Câu 6
        if (answer === 0) score.busyBee += 4;
        if (answer === 1) score.chiller += 1;
        if (answer === 2) score.balancer += 2;
        if (answer === 3) score.overAchiever += 4;
        break;

      case 6: // Câu 7
        if (answer === 0) score.overAchiever += 4;
        if (answer === 1) score.balancer += 2;
        if (answer === 2) score.busyBee += 2;
        if (answer === 3) score.chiller += 4;
        break;

      case 7: // Câu 8
        if (answer === 0) score.chiller += 4;
        if (answer === 1) score.overAchiever += 4;
        if (answer === 2) score.balancer += 2;
        if (answer === 3) score.busyBee += 2;
        break;

      case 8: // Câu 9
        if (answer === 0) score.balancer += 4;
        if (answer === 1) score.chiller += 4;
        if (answer === 2) score.overAchiever += 1;
        if (answer === 3) score.busyBee += 1;
        break;

      case 9: // Câu 10
        if (answer === 0) score.balancer += 4;
        if (answer === 1) score.chiller += 4;
        if (answer === 2) score.overAchiever += 1;
        if (answer === 3) score.busyBee += 1;
        break;
    }
  });

  return score;
}

// Xác định kiểu tính cách dựa trên điểm số
export function determinePersonalityType(score: PersonalityScore): string {
  const scores = [
    { type: 'busyBee', score: score.busyBee },
    { type: 'chiller', score: score.chiller },
    { type: 'balancer', score: score.balancer },
    { type: 'overAchiever', score: score.overAchiever }
  ];

  // Sắp xếp theo điểm số giảm dần
  scores.sort((a, b) => b.score - a.score);

  const maxScore = scores[0].score;

  // Tìm tất cả các tính cách có điểm cao nhất
  const topScores = scores.filter(s => s.score === maxScore);

  // Nếu chỉ có 1 tính cách có điểm cao nhất
  if (topScores.length === 1) {
    return topScores[0].type;
  }

  // Nếu có nhiều tính cách có điểm bằng nhau, xử lý đặc biệt
  if (topScores.length === 2) {
    // Trường hợp 2 tính cách bằng nhau - ưu tiên theo thứ tự
    const priorityOrder = ['balancer', 'chiller', 'busyBee', 'overAchiever'];
    for (const priority of priorityOrder) {
      if (topScores.some(s => s.type === priority)) {
        return priority;
      }
    }
  }

  if (topScores.length === 3) {
    // Trường hợp 3 tính cách bằng nhau - ưu tiên Balancer
    if (topScores.some(s => s.type === 'balancer')) {
      return 'balancer';
    }
    // Nếu không có Balancer, ưu tiên Chiller
    if (topScores.some(s => s.type === 'chiller')) {
      return 'chiller';
    }
  }

  if (topScores.length === 4) {
    // Trường hợp tất cả bằng nhau - mặc định Balancer
    return 'balancer';
  }

  // Fallback
  return 'balancer';
}

// Hàm để lấy thông tin chi tiết về kết quả
export function getDetailedResult(score: PersonalityScore): {
  primaryType: string;
  secondaryTypes: string[];
  isTie: boolean;
  scoreDetails: Array<{ type: string, score: number }>;
} {
  const scores = [
    { type: 'busyBee', score: score.busyBee },
    { type: 'chiller', score: score.chiller },
    { type: 'balancer', score: score.balancer },
    { type: 'overAchiever', score: score.overAchiever }
  ];

  // Sắp xếp theo điểm số giảm dần
  scores.sort((a, b) => b.score - a.score);

  const maxScore = scores[0].score;
  const topScores = scores.filter(s => s.score === maxScore);

  const primaryType = determinePersonalityType(score);
  const secondaryTypes = topScores
    .filter(s => s.type !== primaryType)
    .map(s => s.type);

  return {
    primaryType,
    secondaryTypes,
    isTie: topScores.length > 1,
    scoreDetails: scores
  };
}
