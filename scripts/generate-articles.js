/**
 * Script tạo hàng nghìn bài viết về sức khỏe, gym, dinh dưỡng
 * Run: node scripts/generate-articles.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Categories
const CATEGORIES = [
    'Kiến Thức Tập Luyện',
    'Dinh Dưỡng',
    'Phục Hồi',
    'Sức Khỏe Tinh Thần',
    'Thực Phẩm Bổ Sung',
    'Giải Phẫu Cơ Thể',
    'Chế Độ Ăn',
    'Cardio & Endurance',
    'Strength Training',
    'Yoga & Flexibility',
    'Chấn Thương & Phòng Ngừa',
    'Lối Sống Khỏe',
    'Giảm Cân',
    'Tăng Cơ',
    'CrossFit & HIIT',
    'Calisthenics',
    'Powerlifting',
    'Bodybuilding',
    'Thể Thao',
    'Sức Khỏe Nam Giới',
    'Sức Khỏe Nữ Giới',
];

// Topics templates
const TOPICS = {
    'Kiến Thức Tập Luyện': [
        { title: 'Hướng dẫn tập {muscle} cho người mới bắt đầu', summary: 'Các bài tập cơ bản và kỹ thuật đúng để phát triển {muscle} hiệu quả.' },
        { title: 'Top 10 bài tập {muscle} hiệu quả nhất', summary: 'Danh sách các bài tập được khoa học chứng minh giúp phát triển {muscle}.' },
        { title: 'Lịch tập {muscle} {days} ngày/tuần', summary: 'Chương trình tập luyện chi tiết cho {muscle} với tần suất {days} buổi mỗi tuần.' },
        { title: 'Sai lầm phổ biến khi tập {muscle}', summary: 'Những lỗi thường gặp khiến bạn không phát triển {muscle} như mong muốn.' },
        { title: 'Cách tăng sức mạnh {muscle} nhanh chóng', summary: 'Phương pháp progressive overload và technique để maximize sức mạnh {muscle}.' },
        { title: 'So sánh: {exercise1} vs {exercise2}', summary: 'Phân tích chi tiết ưu nhược điểm của hai bài tập phổ biến.' },
        { title: 'Bí quyết Mind-Muscle Connection khi tập {muscle}', summary: 'Kỹ thuật tập trung tinh thần để kích hoạt tối đa sợi cơ {muscle}.' },
        { title: 'Warm-up đúng cách trước khi tập {muscle}', summary: 'Các bài khởi động giúp phòng tránh chấn thương và tăng hiệu suất tập.' },
        { title: 'Drop Set và Superset cho {muscle}', summary: 'Kỹ thuật nâng cao để phá vỡ plateau và kích thích tăng trưởng {muscle}.' },
        { title: 'Tổng hợp khoa học về hypertrophy {muscle}', summary: 'Nghiên cứu mới nhất về cơ chế phát triển cơ bắp {muscle}.' },
    ],
    'Dinh Dưỡng': [
        { title: 'Chế độ ăn {diet} cho người tập gym', summary: 'Hướng dẫn chi tiết về chế độ ăn {diet} kết hợp tập luyện.' },
        { title: 'Top {number} thực phẩm giàu protein', summary: 'Danh sách thực phẩm chứa nhiều protein nhất cho người tập gym.' },
        { title: 'Cách tính TDEE và Macro chuẩn xác', summary: 'Công thức và phương pháp tính toán lượng calo và macro cần thiết.' },
        { title: 'Meal prep cho {goal}: Hướng dẫn từ A-Z', summary: 'Cách chuẩn bị bữa ăn cả tuần để đạt mục tiêu {goal}.' },
        { title: '{food} - Siêu thực phẩm cho người tập', summary: 'Giá trị dinh dưỡng và cách chế biến {food} hiệu quả nhất.' },
        { title: 'Ăn gì trước/sau khi tập gym?', summary: 'Hướng dẫn chi tiết về pre-workout và post-workout nutrition.' },
        { title: 'Intermittent Fasting kết hợp tập gym', summary: 'Cách áp dụng nhịn ăn gián đoạn mà vẫn tăng cơ hiệu quả.' },
        { title: 'Carb Cycling: Chiến lược ăn carbs thông minh', summary: 'Phương pháp điều chỉnh carbs theo ngày tập và ngày nghỉ.' },
        { title: 'Hydration: Uống nước đúng cách khi tập', summary: 'Tầm quan trọng của nước và điện giải với hiệu suất tập luyện.' },
        { title: 'Chế độ ăn cho người làm việc văn phòng', summary: 'Giải pháp dinh dưỡng cho người ít vận động, ngồi nhiều.' },
    ],
    'Phục Hồi': [
        { title: 'Tầm quan trọng của giấc ngủ với tập gym', summary: 'Tại sao ngủ đủ giấc là yếu tố quyết định sự phát triển cơ bắp.' },
        { title: 'Foam Rolling: Hướng dẫn từ cơ bản đến nâng cao', summary: 'Kỹ thuật sử dụng foam roller để phục hồi cơ bắp hiệu quả.' },
        { title: 'Stretching: Bài tập giãn cơ sau tập', summary: 'Các bài stretch giúp giảm đau nhức và tăng flexibility.' },
        { title: 'Ice Bath vs Sauna: Đâu là phương pháp tốt hơn?', summary: 'So sánh hai phương pháp phục hồi phổ biến nhất.' },
        { title: 'Deload Week: Khi nào cần và cách thực hiện', summary: 'Hướng dẫn về tuần tập nhẹ để phục hồi hệ thần kinh.' },
        { title: 'Massage Therapy cho vận động viên', summary: 'Các loại massage và lợi ích với người tập thể thao.' },
        { title: 'Active Recovery: Ngày nghỉ tích cực', summary: 'Hoạt động nhẹ nhàng giúp phục hồi nhanh hơn ngồi yên.' },
        { title: 'Sleep Optimization: Ngủ ngon để tăng cơ', summary: 'Tips cải thiện chất lượng giấc ngủ cho người tập gym.' },
        { title: 'Mobility Routine: 15 phút mỗi ngày', summary: 'Bài tập mobility giúp cải thiện range of motion.' },
        { title: 'Xử lý DOMS (đau cơ sau tập)', summary: 'Cách giảm đau nhức cơ và phục hồi nhanh sau buổi tập nặng.' },
    ],
    'Sức Khỏe Tinh Thần': [
        { title: 'Gym và sức khỏe tinh thần', summary: 'Tập luyện giúp giảm stress, lo âu và trầm cảm như thế nào.' },
        { title: 'Mindfulness trong phòng tập', summary: 'Kỹ thuật tập trung tinh thần để nâng cao hiệu quả tập luyện.' },
        { title: 'Vượt qua gym anxiety', summary: 'Cách đối phó với lo lắng khi mới bước vào phòng tập.' },
        { title: 'Motivation: Giữ động lực tập luyện lâu dài', summary: 'Chiến lược duy trì động lực workout mỗi ngày.' },
        { title: 'Discipline over Motivation', summary: 'Tại sao kỷ luật quan trọng hơn động lực trong fitness.' },
        { title: 'Meditation cho người tập gym', summary: 'Lợi ích của thiền định với performance và recovery.' },
        { title: 'Body Dysmorphia: Nhận diện và đối phó', summary: 'Hiểu về rối loạn hình ảnh cơ thể ở người tập gym.' },
        { title: 'Work-Life-Gym Balance', summary: 'Cân bằng giữa công việc, cuộc sống và tập luyện.' },
        { title: 'Breathing Techniques cho Lifting', summary: 'Kỹ thuật thở đúng khi nâng tạ để tối ưu performance.' },
        { title: 'Visualization: Tưởng tượng để thành công', summary: 'Phương pháp hình dung được vận động viên elite sử dụng.' },
    ],
    'Thực Phẩm Bổ Sung': [
        { title: '{supplement} Review: Có thật sự hiệu quả?', summary: 'Đánh giá khoa học về {supplement} và liệu bạn có cần nó không.' },
        { title: 'So sánh các loại Whey Protein trên thị trường', summary: 'Concentrate, Isolate, Hydrolysate - đâu là lựa chọn tốt nhất?' },
        { title: 'Pre-Workout: Lựa chọn và sử dụng đúng cách', summary: 'Hướng dẫn về pre-workout supplement cho người mới.' },
        { title: 'Creatine: Hướng dẫn toàn diện', summary: 'Mọi thứ bạn cần biết về creatine monohydrate.' },
        { title: 'BCAA vs EAA: Đâu là lựa chọn tốt hơn?', summary: 'So sánh hai loại amino acid phổ biến.' },
        { title: 'Caffeine và hiệu suất tập luyện', summary: 'Cách sử dụng caffeine để tối ưu performance.' },
        { title: 'Omega-3: Lợi ích với người tập gym', summary: 'Vai trò của dầu cá với viêm nhiễm và recovery.' },
        { title: 'Vitamin D: Tại sao người tập gym cần bổ sung?', summary: 'Thiếu vitamin D ảnh hưởng đến testosterone và sức khỏe.' },
        { title: 'ZMA: Sleep Support cho gymer', summary: 'Kẽm, Magie và B6 giúp cải thiện giấc ngủ và recovery.' },
        { title: 'Glutamine: Cần thiết hay lãng phí tiền?', summary: 'Đánh giá về glutamine supplement cho người tập.' },
    ],
    'Chế Độ Ăn': [
        { title: 'Keto Diet cho người tập gym', summary: 'Hướng dẫn ăn keto mà vẫn duy trì và phát triển cơ bắp.' },
        { title: 'Paleo Diet: Ăn như người nguyên thủy', summary: 'Chế độ ăn paleo và ứng dụng cho người tập thể thao.' },
        { title: 'Vegan Bodybuilding: Có thể được không?', summary: 'Xây dựng cơ bắp với chế độ ăn thuần thực vật.' },
        { title: 'Mediterranean Diet và sức khỏe tim mạch', summary: 'Chế độ ăn Địa Trung Hải cho người tập cardio.' },
        { title: 'Carnivore Diet: Chỉ ăn thịt có ổn không?', summary: 'Phân tích về chế độ ăn toàn thịt cho người tập.' },
        { title: 'Flexible Dieting (IIFYM)', summary: 'Ăn gì cũng được miễn đủ macro - sự thật hay ảo tưởng?' },
        { title: 'Cutting Diet: Giảm mỡ giữ cơ', summary: 'Chế độ ăn trong giai đoạn cắt nét, giảm mỡ.' },
        { title: 'Bulking Diet: Tăng cân tăng cơ', summary: 'Cách ăn để tăng khối lượng cơ bắp hiệu quả.' },
        { title: 'Lean Bulk: Tăng cơ không tăng mỡ', summary: 'Chiến lược ăn uống để tăng cơ với mỡ thừa tối thiểu.' },
        { title: 'Reverse Dieting: Thoát khỏi plateau', summary: 'Cách tăng dần calo sau giai đoạn ăn kiêng.' },
    ],
    'Giảm Cân': [
        { title: 'Cách giảm {kg} kg trong {weeks} tuần', summary: 'Kế hoạch giảm cân an toàn và hiệu quả cho người mới.' },
        { title: 'Cardio hay Weights để giảm mỡ?', summary: 'So sánh hiệu quả đốt mỡ giữa tập cardio và tập tạ.' },
        { title: 'Tại sao bạn không giảm được cân?', summary: 'Những sai lầm khiến quá trình giảm cân bị đình trệ.' },
        { title: 'Metabolic Adaptation: Khi cơ thể chống giảm cân', summary: 'Hiểu về sự thích nghi chuyển hóa và cách vượt qua.' },
        { title: 'Stubborn Fat: Cách giảm mỡ cứng đầu', summary: 'Chiến lược đốt mỡ vùng bụng, đùi, tay hiệu quả.' },
        { title: 'NEAT: Bí mật để đốt thêm 500 calo mỗi ngày', summary: 'Tăng hoạt động không tập luyện để giảm cân nhanh hơn.' },
        { title: 'Refeed Day: Ăn nhiều để giảm mỡ?', summary: 'Cách sử dụng ngày ăn nhiều carbs trong diet.' },
        { title: 'Diet Breaks: Nghỉ ngơi khi ăn kiêng', summary: 'Tại sao cần nghỉ ngơi giữa các giai đoạn cut.' },
        { title: 'Body Recomposition: Giảm mỡ tăng cơ cùng lúc', summary: 'Có thể vừa giảm mỡ vừa tăng cơ được không?' },
        { title: 'Fat Loss Plateu: Vượt qua giai đoạn đình trệ', summary: 'Chiến lược khi cân không giảm dù đang ăn kiêng.' },
    ],
    'Tăng Cơ': [
        { title: 'Hardgainer Guide: Cách tăng cân cho người gầy', summary: 'Chiến lược tăng cân và tăng cơ cho ectomorph.' },
        { title: 'Bulking cho người mới: Từ A-Z', summary: 'Mọi thứ về giai đoạn tăng khối lượng cho beginner.' },
        { title: 'Dirty Bulk vs Clean Bulk', summary: 'Nên ăn bẩn hay ăn sạch khi đang bulk?' },
        { title: 'Tối ưu Protein Synthesis', summary: 'Cách tối đa hóa tổng hợp protein để tăng cơ.' },
        { title: 'Training Volume cho Hypertrophy', summary: 'Bao nhiêu set mỗi tuần là tối ưu để tăng cơ?' },
        { title: 'Progressive Overload: Nguyên tắc vàng', summary: 'Tăng dần áp lực - chìa khóa để không ngừng phát triển.' },
        { title: 'Compound vs Isolation Exercises', summary: 'Nên focus bài nào để tăng cơ hiệu quả nhất?' },
        { title: 'Rep Range tối ưu cho Hypertrophy', summary: 'Bao nhiêu rep mỗi set để kích thích tăng cơ?' },
        { title: 'Time Under Tension (TUT)', summary: 'Vai trò của thời gian chịu tải với sự phát triển cơ bắp.' },
        { title: 'Genetic Potential: Giới hạn của bạn ở đâu?', summary: 'Tìm hiểu về tiềm năng gen và mục tiêu thực tế.' },
    ],
    'Cardio & Endurance': [
        { title: 'HIIT vs LISS: Cardio nào tốt hơn?', summary: 'So sánh hai phương pháp cardio phổ biến nhất.' },
        { title: 'Zone 2 Cardio: Bí mật của vận động viên elite', summary: 'Tại sao tập cardio cường độ thấp lại hiệu quả.' },
        { title: 'Running for Beginners', summary: 'Hướng dẫn bắt đầu chạy bộ cho người mới.' },
        { title: 'Cycling: Đạp xe đúng cách', summary: 'Kỹ thuật và chương trình tập đạp xe hiệu quả.' },
        { title: 'Swimming Workout', summary: 'Bơi lội - cardio toàn thân ít impact.' },
        { title: 'Jump Rope: Cardio hiệu quả nhất?', summary: 'Nhảy dây đốt bao nhiêu calo và cách tập.' },
        { title: 'Rowing Machine Guide', summary: 'Hướng dẫn sử dụng máy rowing đúng kỹ thuật.' },
        { title: 'Stair Climbing: Leo cầu thang như workout', summary: 'Cardio đơn giản ai cũng có thể làm.' },
        { title: 'Tabata Training: 4 phút hiệu quả', summary: 'Phương pháp interval 20s on 10s off.' },
        { title: 'VO2 Max: Chỉ số quan trọng của cardio', summary: 'Hiểu và cải thiện khả năng hấp thu oxy tối đa.' },
    ],
    'Strength Training': [
        { title: 'Starting Strength: Chương trình cho newbie', summary: 'Chương trình 3x5 kinh điển cho người mới tập.' },
        { title: '5x5 StrongLifts: Review chi tiết', summary: 'Phân tích ưu nhược điểm của chương trình 5x5.' },
        { title: 'nSuns 5/3/1: Chương trình tăng sức mạnh', summary: 'Hướng dẫn chương trình nSuns từ A-Z.' },
        { title: 'Conjugate Method: Westside Barbell', summary: 'Phương pháp tập của powerlifter đỉnh cao.' },
        { title: 'RPE và Autoregulation', summary: 'Cách sử dụng Rate of Perceived Exertion trong training.' },
        { title: '1RM Testing: Cách test max an toàn', summary: 'Hướng dẫn test sức mạnh tối đa đúng cách.' },
        { title: 'Peaking Program cho thi đấu', summary: 'Cách chuẩn bị cho ngày thi powerlifting.' },
        { title: 'Block Periodization', summary: 'Phương pháp chia chu kỳ thành các block.' },
        { title: 'Accessory Work: Bài phụ trợ', summary: 'Các bài tập phụ giúp cải thiện lift chính.' },
        { title: 'Sticking Points: Vượt qua điểm yếu', summary: 'Cách xử lý điểm kẹt trong các bài lift.' },
    ],
    'Yoga & Flexibility': [
        { title: 'Yoga cho người tập gym', summary: 'Lợi ích của yoga với lifter và cách kết hợp.' },
        { title: 'Mobility vs Flexibility: Sự khác biệt', summary: 'Phân biệt hai khái niệm và cách cải thiện.' },
        { title: 'Hip Mobility: Mở hông để Squat tốt hơn', summary: 'Bài tập cải thiện độ linh hoạt hông.' },
        { title: 'Shoulder Mobility: Overhead Press hoàn hảo', summary: 'Tăng ROM vai để press an toàn và mạnh hơn.' },
        { title: 'Ankle Mobility: Gót chân không nhấc', summary: 'Cải thiện dorsiflexion cho squat sâu.' },
        { title: 'Thoracic Spine Mobility', summary: 'Mở cột sống ngực cho posture tốt hơn.' },
        { title: 'PNF Stretching: Kỹ thuật nâng cao', summary: 'Proprioceptive Neuromuscular Facilitation là gì?' },
        { title: 'Dynamic vs Static Stretching', summary: 'Khi nào dùng loại stretch nào?' },
        { title: 'Loaded Stretching: Kéo giãn có tải', summary: 'Phương pháp kết hợp strength và flexibility.' },
        { title: 'Morning Mobility Routine', summary: 'Bài tập mobility 10 phút mỗi sáng.' },
    ],
    'Chấn Thương & Phòng Ngừa': [
        { title: 'Đau lưng dưới khi tập gym', summary: 'Nguyên nhân và cách xử lý đau thắt lưng.' },
        { title: 'Đau vai khi Bench Press', summary: 'Lỗi kỹ thuật gây đau vai và cách sửa.' },
        { title: 'Đau gối khi Squat', summary: 'Tại sao đầu gối đau và cách phòng tránh.' },
        { title: 'Tennis Elbow: Đau khuỷu tay', summary: 'Xử lý tình trạng đau khuỷu tay khi tập.' },
        { title: 'Rotator Cuff: Bảo vệ vai của bạn', summary: 'Cách tập để phòng ngừa chấn thương vai.' },
        { title: 'Herniated Disc: Thoát vị đĩa đệm', summary: 'Tập gym an toàn với thoát vị đĩa đệm.' },
        { title: 'Muscle Strain: Căng cơ và cách xử lý', summary: 'Phân biệt căng cơ và cách phục hồi.' },
        { title: 'Warm-up Protocol: Khởi động đúng cách', summary: 'Quy trình khởi động phòng ngừa chấn thương.' },
        { title: 'Form Check: Tự kiểm tra kỹ thuật', summary: 'Cách tự đánh giá và sửa form.' },
        { title: 'When to See a Doctor', summary: 'Khi nào cần gặp bác sĩ thay vì tự chữa.' },
    ],
    'Lối Sống Khỏe': [
        { title: 'Morning Routine cho người tập gym', summary: 'Thói quen buổi sáng giúp tối ưu performance.' },
        { title: 'Sleep Hygiene: Ngủ ngon hơn', summary: 'Các tips cải thiện chất lượng giấc ngủ.' },
        { title: 'Stress Management cho gymer', summary: 'Quản lý stress để không ảnh hưởng đến training.' },
        { title: 'Alcohol và Fitness', summary: 'Rượu bia ảnh hưởng đến tập luyện như thế nào.' },
        { title: 'Smoking và hiệu suất tập', summary: 'Tác hại của thuốc lá với người tập gym.' },
        { title: 'Standing Desk: Làm việc đứng', summary: 'Lợi ích của việc đứng làm việc với sức khỏe.' },
        { title: 'Posture: Tư thế đúng mỗi ngày', summary: 'Cách cải thiện tư thế khi ngồi và đứng.' },
        { title: 'Meal Timing: Ăn đúng giờ', summary: 'Thời điểm ăn ảnh hưởng đến metabolism.' },
        { title: 'Sunlight và Vitamin D', summary: 'Tầm quan trọng của ánh nắng với sức khỏe.' },
        { title: 'Digital Detox: Giảm thời gian màn hình', summary: 'Hạn chế điện thoại để ngủ ngon và tập trung hơn.' },
    ],
    'CrossFit & HIIT': [
        { title: 'CrossFit WOD cho người mới', summary: 'Các workout of the day phù hợp cho beginner.' },
        { title: 'EMOM: Every Minute on the Minute', summary: 'Cách thiết kế và thực hiện EMOM workout.' },
        { title: 'AMRAP: As Many Reps As Possible', summary: 'Chiến lược để maximize rep trong AMRAP.' },
        { title: 'Chipper Workout là gì?', summary: 'Loại hình workout dài với nhiều bài tập.' },
        { title: 'Kipping Pull-up: Đúng hay sai?', summary: 'Tranh cãi về kipping và strict pull-up.' },
        { title: 'Box Jump: Kỹ thuật và safety', summary: 'Cách nhảy box an toàn và hiệu quả.' },
        { title: 'Thruster: King of CrossFit', summary: 'Bài tập combination squat + press.' },
        { title: 'Burpee: Love or Hate', summary: 'Tại sao burpee hiệu quả và cách làm đúng.' },
        { title: 'Double Under: Nhảy dây nâng cao', summary: 'Master kỹ thuật double under.' },
        { title: 'CrossFit vs Traditional Gym', summary: 'So sánh hai phương pháp tập luyện.' },
    ],
    'Calisthenics': [
        { title: 'Calisthenics cho người mới bắt đầu', summary: 'Hướng dẫn tập với trọng lượng cơ thể.' },
        { title: 'Pull-up Progression: Từ 0 đến 10 reps', summary: 'Lộ trình tập pull-up cho người chưa làm được.' },
        { title: 'Push-up Variations', summary: 'Các biến thể push-up từ dễ đến khó.' },
        { title: 'Dip: Bài tập ngực và triceps', summary: 'Kỹ thuật dip đúng cách.' },
        { title: 'Muscle-up: Hướng dẫn chi tiết', summary: 'Cách tiến đến muscle-up đầu tiên.' },
        { title: 'Planche: Skill nâng cao', summary: 'Lộ trình tập planche từ beginner.' },
        { title: 'Front Lever: Core strength', summary: 'Bài tập lưng và core với xà.' },
        { title: 'Handstand: Cân bằng trên tay', summary: 'Hướng dẫn tập handstand từ zero.' },
        { title: 'L-Sit: Foundational skill', summary: 'Bài tập core cơ bản của calisthenics.' },
        { title: 'Pistol Squat: Squat một chân', summary: 'Lộ trình đến pistol squat hoàn hảo.' },
    ],
    'Powerlifting': [
        { title: 'Squat: Hướng dẫn kỹ thuật đầy đủ', summary: 'Mọi thứ về squat từ setup đến execution.' },
        { title: 'Bench Press: Powerlifting Style', summary: 'Kỹ thuật bench press để tối đa sức mạnh.' },
        { title: 'Deadlift: Conventional vs Sumo', summary: 'So sánh hai kiểu deadlift phổ biến.' },
        { title: 'Program cho Powerlifting Beginner', summary: 'Chương trình tập cho người mới chơi PL.' },
        { title: 'Meet Prep: Chuẩn bị thi đấu', summary: 'Hướng dẫn chuẩn bị cho giải powerlifting.' },
        { title: 'Weight Classes: Chọn hạng cân', summary: 'Cách chọn hạng cân phù hợp để thi.' },
        { title: 'Wilks Score: Đánh giá sức mạnh', summary: 'Hiểu về chỉ số so sánh sức mạnh.' },
        { title: 'Belt và Accessories', summary: 'Khi nào nên dùng belt và phụ kiện.' },
        { title: 'Paused vs Touch-and-Go', summary: 'Hai kiểu bench press khác nhau.' },
        { title: 'Sumo Deadlift: Kỹ thuật chi tiết', summary: 'Hướng dẫn sumo deadlift từ A-Z.' },
    ],
    'Bodybuilding': [
        { title: 'Bodybuilding Split: Chia lịch tập', summary: 'Các kiểu split phổ biến trong bodybuilding.' },
        { title: 'PPL: Push Pull Legs', summary: 'Chương trình PPL classic cho hypertrophy.' },
        { title: 'Bro Split: Có còn hiệu quả?', summary: 'Phân tích về kiểu chia lịch theo nhóm cơ.' },
        { title: 'Upper Lower Split', summary: 'Chia thân trên/thân dưới cho intermediate.' },
        { title: 'Contest Prep: Chuẩn bị thi đấu BB', summary: 'Quá trình chuẩn bị cho show bodybuilding.' },
        { title: 'Posing: Nghệ thuật tạo dáng', summary: 'Hướng dẫn posing cho bodybuilder.' },
        { title: 'Symmetry và Proportions', summary: 'Cân đối cơ thể trong bodybuilding.' },
        { title: 'Peak Week: Tuần cuối trước thi', summary: 'Chiến lược peak week cho show.' },
        { title: 'Pump Chasing: Có cần thiết?', summary: 'Vai trò của pump với hypertrophy.' },
        { title: 'Classic Physique vs Men\'s Open', summary: 'Sự khác biệt giữa các hạng mục.' },
    ],
    'Thể Thao': [
        { title: 'Strength Training cho Runner', summary: 'Tập tạ giúp chạy bộ tốt hơn?' },
        { title: 'Gym cho Footballers', summary: 'Chương trình tập cho cầu thủ bóng đá.' },
        { title: 'Basketball Conditioning', summary: 'Thể lực cho người chơi bóng rổ.' },
        { title: 'Swimming: Cross-training', summary: 'Bơi lội như hình thức tập bổ sung.' },
        { title: 'Tennis và Fitness', summary: 'Thể lực cho người chơi tennis.' },
        { title: 'Golf Fitness: Swing mạnh hơn', summary: 'Tập gym để cải thiện golf swing.' },
        { title: 'Martial Arts Conditioning', summary: 'Thể lực cho võ thuật.' },
        { title: 'Cycling Performance', summary: 'Gym giúp đạp xe tốt hơn.' },
        { title: 'Endurance Sports Nutrition', summary: 'Dinh dưỡng cho người chơi thể thao sức bền.' },
        { title: 'In-Season vs Off-Season Training', summary: 'Tập khác nhau thế nào theo mùa giải.' },
    ],
    'Sức Khỏe Nam Giới': [
        { title: 'Testosterone: Hormone quan trọng nhất', summary: 'Vai trò của testosterone với cơ bắp và sức khỏe.' },
        { title: 'Tự nhiên tăng Testosterone', summary: 'Cách tăng T-level không cần thuốc.' },
        { title: 'Sleep và Testosterone', summary: 'Ngủ đủ giấc ảnh hưởng đến hormone.' },
        { title: 'Estrogen ở nam giới', summary: 'Vai trò và vấn đề của estrogen với nam.' },
        { title: 'Prostate Health', summary: 'Chăm sóc sức khỏe tuyến tiền liệt.' },
        { title: 'Hair Loss và Gym', summary: 'Tập gym có gây rụng tóc không?' },
        { title: 'Fertility và Fitness', summary: 'Ảnh hưởng của tập luyện đến sinh sản.' },
        { title: 'Low T Symptoms', summary: 'Dấu hiệu testosterone thấp.' },
        { title: 'Zinc cho nam giới', summary: 'Khoáng chất quan trọng cho hormone nam.' },
        { title: 'Cardio và Testosterone', summary: 'Cardio quá nhiều có hại T-level?' },
    ],
    'Sức Khỏe Nữ Giới': [
        { title: 'Tập gym khi có kinh nguyệt', summary: 'Có nên tập trong những ngày đèn đỏ?' },
        { title: 'Hormone nữ và Training', summary: 'Estrogen, Progesterone ảnh hưởng đến tập.' },
        { title: 'Tập gym khi mang thai', summary: 'An toàn tập luyện cho bà bầu.' },
        { title: 'Postpartum Fitness', summary: 'Quay lại tập sau sinh.' },
        { title: 'Bulking cho nữ', summary: 'Nữ có nên bulk không?' },
        { title: 'Strength Training cho nữ', summary: 'Tập nặng không làm nữ to cơ bắp.' },
        { title: 'Glutes Training', summary: 'Bài tập mông cho nữ.' },
        { title: 'Bone Density và Weight Training', summary: 'Tập tạ phòng loãng xương.' },
        { title: 'Iron Deficiency: Thiếu sắt', summary: 'Vấn đề thiếu sắt ở phụ nữ tập gym.' },
        { title: 'Birth Control và Performance', summary: 'Ảnh hưởng của thuốc tránh thai.' },
    ],
};

// Variables for templates
const MUSCLES = ['ngực', 'lưng', 'vai', 'tay', 'chân', 'mông', 'bụng', 'core', 'cẳng tay', 'bắp chân'];
const EXERCISES = ['Squat', 'Deadlift', 'Bench Press', 'Pull-up', 'Row', 'Overhead Press', 'Dip', 'Lunge', 'Plank', 'Curl'];
const FOODS = ['Ức gà', 'Cá hồi', 'Trứng', 'Thịt bò', 'Đậu hũ', 'Yến mạch', 'Khoai lang', 'Gạo lứt', 'Bông cải xanh', 'Quả bơ', 'Chuối', 'Sữa chua Hy Lạp', 'Hạnh nhân', 'Quinoa', 'Đậu lăng'];
const SUPPLEMENTS = ['Whey Protein', 'Creatine', 'BCAA', 'Pre-workout', 'Fish Oil', 'Vitamin D', 'ZMA', 'Glutamine', 'Beta-Alanine', 'Citrulline', 'Ashwagandha', 'Caffeine'];
const DIETS = ['Low Carb', 'High Protein', 'Keto', 'Paleo', 'Vegan', 'Mediterranean', 'Clean Eating', 'Whole30'];
const GOALS = ['giảm mỡ', 'tăng cơ', 'tăng sức mạnh', 'cải thiện sức bền', 'giữ form'];
const DAYS = [3, 4, 5, 6];
const NUMBERS = [5, 7, 10, 15, 20];
const KGS = [3, 5, 7, 10];
const WEEKS = [4, 6, 8, 12];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template, vars) {
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
}

function generateRandomDate() {
    const start = new Date(2024, 0, 1);
    const end = new Date(2026, 1, 1);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function generateContent(title, summary) {
    return `## ${title}\n\n${summary}\n\n### Chi tiết\nNội dung chi tiết về chủ đề này sẽ giúp bạn hiểu rõ hơn và áp dụng vào thực tế tập luyện.\n\n### Lời khuyên\n- Hãy kiên nhẫn và consistent\n- Lắng nghe cơ thể\n- Tham khảo ý kiến chuyên gia nếu cần`;
}

function generateArticles(count) {
    const articles = [];
    const categories = Object.keys(TOPICS);

    for (let i = 0; i < count; i++) {
        const category = getRandomItem(categories);
        const template = getRandomItem(TOPICS[category]);

        const vars = {
            muscle: getRandomItem(MUSCLES),
            exercise1: getRandomItem(EXERCISES),
            exercise2: getRandomItem(EXERCISES),
            food: getRandomItem(FOODS),
            supplement: getRandomItem(SUPPLEMENTS),
            diet: getRandomItem(DIETS),
            goal: getRandomItem(GOALS),
            days: getRandomItem(DAYS),
            number: getRandomItem(NUMBERS),
            kg: getRandomItem(KGS),
            weeks: getRandomItem(WEEKS),
        };

        const title = fillTemplate(template.title, vars);
        const summary = fillTemplate(template.summary, vars);

        articles.push({
            id: `gen-${String(i + 1).padStart(6, '0')}`,
            title,
            category,
            summary,
            content: generateContent(title, summary),
            date: generateRandomDate(),
        });
    }

    return articles;
}

// Main
const NUM_ARTICLES = 5000; // Generate 5000 articles
console.log(`Generating ${NUM_ARTICLES} articles...`);

const newArticles = generateArticles(NUM_ARTICLES);

// Read existing articles
const existingPath = path.join(__dirname, '..', 'src', 'data', 'articles.json');
let existingArticles = [];
try {
    existingArticles = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
    console.log(`Found ${existingArticles.length} existing articles.`);
} catch (e) {
    console.log('No existing articles found, creating new file.');
}

// Combine and save
const allArticles = [...existingArticles, ...newArticles];
fs.writeFileSync(existingPath, JSON.stringify(allArticles, null, 4), 'utf8');

console.log(`✅ Done! Total articles: ${allArticles.length}`);
console.log(`📁 Saved to: ${existingPath}`);
