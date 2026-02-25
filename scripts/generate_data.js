
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesPath = path.join('d:/tap gyp/src/data/articles.json');
const qaPath = path.join('d:/tap gyp/src/data/qa.json');

// Helper to get random item from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Knowledge Base
const categories = ["Kiến Thức Tập Luyện", "Dinh Dưỡng", "Phục Hồi", "Sức Khỏe Tinh Thần", "Giải Phẫu Cơ Thể", "Thực Phẩm Bổ Sung"];
const muscles = ["Cơ Ngực (Chest)", "Cơ Lưng (Back)", "Cơ Vai (Shoulder)", "Cơ Tay (Arms)", "Cơ Chân (Legs)", "Cơ Bụng (Abs)", "Toàn Thân (Full Body)"];
const exercises = ["Squat", "Deadlift", "Bench Press", "Overhead Press", "Pull Up", "Dip", "Lunge", "Row", "Plank", "HIIT", "Cardio LISS"];
const foods = ["Ức gà", "Khoai lang", "Yến mạch", "Cá hồi", "Bông cải xanh", "Trứng", "Whey Protein", "Creatine", "BCAA", "Omega-3"];
const concepts = ["Progressive Overload", "Hypertrophy", "Strength", "Endurance", "Mobility", "Flexibility", "Macro", "Calorie Deficit", "Bulking", "Cutting"];

// Generators for Articles
const generateArticle = (id) => {
    const category = getRandom(categories);
    const muscle = getRandom(muscles);
    const exercise = getRandom(exercises);
    const food = getRandom(foods);
    const concept = getRandom(concepts);

    let title = "";
    let summary = "";
    let content = "";

    switch (category) {
        case "Kiến Thức Tập Luyện":
            title = `Tối ưu hóa bài tập ${exercise} để phát triển ${muscle} hiệu quả nhất`;
            summary = `Phân tích kỹ thuật ${exercise} và cách tác động sâu vào ${muscle} thông qua nguyên lý ${concept}.`;
            content = `## Giới thiệu\nBài tập ${exercise} là vua của các bài tập cho ${muscle}. Tuy nhiên, nhiều người tập sai kỹ thuật dẫn đến chấn thương.\n\n### Kỹ thuật chuẩn\n1. Giữ lưng thẳng.\n2. Kiểm soát hơi thở.\n3. Tập trung vào ${concept} để kích thích cơ tốt nhất.\n\n### Lịch tập gợi ý\n- 4 hiệp x 8-12 lần.\n- Nghỉ 90 giây giữa hiệp.`;
            break;
        case "Dinh Dưỡng":
            title = `Tại sao ${food} là siêu thực phẩm cho người tập gym?`;
            summary = `Khám phá thành phần dinh dưỡng của ${food} và cách nó hỗ trợ quá trình ${concept}.`;
            content = `## Giá trị dinh dưỡng\n${food} chứa nhiều dưỡng chất quan trọng giúp phục hồi cơ bắp.\n\n### Lợi ích\n- Cung cấp năng lượng sạch.\n- Hỗ trợ xây dựng cơ bắp nạc.\n- Phù hợp cho cả giai đoạn Bulking và Cutting.\n\n### Cách chế biến\nKết hợp ${food} vào bữa ăn post-workout để đạt hiệu quả cao nhất.`;
            break;
        case "Phục Hồi":
            title = `Phương pháp phục hồi sau buổi tập ${muscle} nặng`;
            summary = `Đừng để đau nhức ngăn cản bạn. Học cách phục hồi nhanh chóng để quay lại phòng tập sớm hơn.`;
            content = `## Tầm quan trọng của phục hồi\nCơ bắp lớn lên khi bạn nghỉ ngơi, không phải khi bạn tập.\n\n### Mẹo phục hồi\n1. Ngủ đủ 8 tiếng.\n2. Ăn đủ ${food}.\n3. Massage và giãn cơ sau khi tập ${muscle}.\n4. Uống đủ nước.`;
            break;
        case "Sức Khỏe Tinh Thần":
            title = `Rèn luyện ý chí thép với nguyên lý ${concept}`;
            summary = `Gym không chỉ là tập thể xác, mà còn là rèn luyện tinh thần.`;
            content = `## Kỷ luật là sức mạnh\nKhi bạn muốn bỏ cuộc ở rep cuối cùng, đó là lúc ${concept} phát huy tác dụng.\n\n### Lời khuyên\n- Đặt mục tiêu nhỏ.\n- Ghi chép nhật ký tập luyện.\n- Đừng so sánh bản thân với người khác.`;
            break;
        case "Giải Phẫu Cơ Thể":
            title = `Giải phẫu học: Cấu tạo và chức năng của ${muscle}`;
            summary = `Hiểu rõ cơ thể bạn để tập luyện thông minh hơn.`;
            content = `## Vị trí và chức năng\n${muscle} gồm các nhóm cơ nhỏ nào? Chức năng chính là gì?\n\n### Ứng dụng vào bài tập\nKhi tập ${exercise}, hãy cảm nhận sự co duỗi của ${muscle}.\nKết nối Mind-Muscle là chìa khóa.`;
            break;
        case "Thực Phẩm Bổ Sung":
            const supp = getRandom(["Whey", "Pre-workout", "Vitamin D3", "ZMA", "Fish Oil"]);
            title = `Review chi tiết: Có nên dùng ${supp} khi đang ${concept}?`;
            summary = `Sự thật về ${supp} mà các hãng không nói cho bạn biết.`;
            content = `## ${supp} là gì?\nLà thực phẩm bổ sung giúp hỗ trợ quá trình tập luyện.\n\n### Có cần thiết không?\nNếu bạn ăn đủ ${food}, có thể không cần. Tuy nhiên, ${supp} giúp tiện lợi hơn.\n\n### Liều dùng\nTham khảo ý kiến chuyên gia dinh dưỡng.`;
            break;
    }

    return {
        id: `art-${String(id).padStart(3, '0')}`,
        title,
        category,
        summary,
        content,
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
    };
};

// Generators for QA
const questions = [
    "Tập {exercise} có bị đau lưng không?",
    "Ăn {food} nhiều có tốt không?",
    "Làm sao để tăng cơ {muscle} nhanh nhất?",
    "Nên tập {concept} bao nhiêu lần 1 tuần?",
    "Người mới tập có nên dùng {supp} không?",
    "Tại sao tôi tập hoài không to?",
    "Bị đau khớp khi tập {exercise} phải làm sao?",
    "Thực đơn giảm mỡ với {food} như thế nào?"
];

const answers = [
    "Điều này hoàn toàn bình thường, nhưng cần kiểm tra lại kỹ thuật.",
    "Rất tốt, nhưng cần cân đối macro trong ngày.",
    "Hãy tập trung vào Progressive Overload và ăn đủ đạm.",
    "Khoảng 3-4 buổi/tuần là hợp lý cho người mới.",
    "Không bắt buộc, thức ăn tự nhiên vẫn là tốt nhất.",
    "Có thể do bạn chưa ăn đủ calo hoặc chưa ngủ đủ giấc.",
    "Ngưng tập ngay và kiểm tra lại form, hoặc đi khám bác sĩ.",
    "Hãy kết hợp thâm hụt calo và tập kháng lực."
];

const generateQA = (id) => {
    const tmplQ = getRandom(questions);
    const tmplA = getRandom(answers);
    const exercise = getRandom(exercises);
    const food = getRandom(foods);
    const muscle = getRandom(muscles);
    const concept = getRandom(concepts);
    const supp = "Supplement";

    const question = tmplQ
        .replace("{exercise}", exercise)
        .replace("{food}", food)
        .replace("{muscle}", muscle)
        .replace("{concept}", concept)
        .replace("{supp}", supp);

    return {
        id: `qa-${String(id).padStart(3, '0')}`,
        question: question,
        answer: tmplA,
        category: getRandom(categories)
    };
};

// Generate Data
const NEW_ARTICLES_COUNT = 100;
const NEW_QA_COUNT = 100;

let currentArticles = [];
try {
    const articleData = fs.readFileSync(articlesPath, 'utf8');
    currentArticles = JSON.parse(articleData);
} catch (e) {
    console.log("No existing articles found or error reading.", e.message);
}

let currentQA = [];
try {
    const qaData = fs.readFileSync(qaPath, 'utf8');
    currentQA = JSON.parse(qaData);
} catch (e) {
    console.log("No existing QA found or error reading.", e.message);
}

// Append new distinct data
// Reset random unique seed ish by using length as base
const startArtId = currentArticles.length + 1;
for (let i = 0; i < NEW_ARTICLES_COUNT; i++) {
    currentArticles.push(generateArticle(startArtId + i));
}

const startQAId = currentQA.length + 1;
for (let i = 0; i < NEW_QA_COUNT; i++) {
    currentQA.push(generateQA(startQAId + i));
}

// Write back
fs.writeFileSync(articlesPath, JSON.stringify(currentArticles, null, 4), 'utf8');
fs.writeFileSync(qaPath, JSON.stringify(currentQA, null, 4), 'utf8');

console.log(`Generated ${NEW_ARTICLES_COUNT} articles and ${NEW_QA_COUNT} QA items.`);
