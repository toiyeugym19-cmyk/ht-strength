export interface JournalTemplate {
    id: string;
    name: string;
    description: string;
    content: string;
}

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
    {
        id: 'morning-stoic',
        name: 'Sáng Khắc Kỷ',
        description: 'Chuẩn bị tinh thần cho một ngày mới với tư duy khắc kỷ.',
        content: `
<h2>🌅 Suy Ngẫm Buổi Sáng</h2>
<p><strong>1. Điều gì nằm trong tầm kiểm soát của mình hôm nay?</strong></p>
<ul>
    <li>Suy nghĩ của mình về...</li>
    <li>Hành động của mình đối với...</li>
</ul>
<p><strong>2. Mình chấp nhận những điều gì không thể thay đổi?</strong></p>
<p><strong>3. Phẩm hạnh nào mình muốn thể hiện hôm nay? (Dũng cảm, Công bằng, Tiết độ, Khôn ngoan)</strong></p>
        `
    },
    {
        id: 'daily-review',
        name: 'Tổng Kết Ngày',
        description: 'Đánh giá hiệu suất và bài học rút ra cuối ngày.',
        content: `
<h2>🌙 Tổng Kết Ngày</h2>
<p><strong>1. Ba điều mình biết ơn hôm nay:</strong></p>
<ul>
    <li>...</li>
</ul>
<p><strong>2. Mình đã làm tốt điều gì?</strong></p>
<p><strong>3. Mình có thể làm gì tốt hơn?</strong></p>
<p><strong>4. Bài học lớn nhất hôm nay là gì?</strong></p>
        `
    },
    {
        id: 'brain-dump',
        name: 'Xả Stress (Brain Dump)',
        description: 'Viết hết mọi suy nghĩ lộn xộn ra để giải phóng tâm trí.',
        content: `
<h2>🧠 Brain Dump</h2>
<p><em>Viết bất cứ điều gì đang luẩn quẩn trong đầu bạn. Đừng lo về cấu trúc hay ngữ pháp.</em></p>
<ul>
    <li>Đang lo lắng về...</li>
    <li>Cần nhớ làm...</li>
    <li>Ý tưởng nảy ra...</li>
</ul>
        `
    },
    {
        id: 'goal-setting',
        name: 'Thiết Lập Mục Tiêu',
        description: 'Xác định rõ ràng mục tiêu và kế hoạch hành động.',
        content: `
<h2>🎯 Mục Tiêu Mới</h2>
<p><strong>Mục tiêu:</strong> [Cụ thể, Đo lường được]</p>
<p><strong>Tại sao điều này quan trọng?</strong></p>
<p><strong>Kế hoạch hành động:</strong></p>
<ol>
    <li>Bước 1: ...</li>
    <li>Bước 2: ...</li>
</ol>
<p><strong>Hạn chót:</strong> ...</p>
        `
    },
    {
        id: 'gt-reflection',
        name: 'Suy Ngẫm Biết Ơn',
        description: 'Tập trung vào những điều tích cực.',
        content: `
<h2>🙏 Nhật Ký Biết Ơn</h2>
<p><strong>Hôm nay, mình thực sự trân trọng:</strong></p>
<ul>
    <li>Một người đã giúp đỡ mình...</li>
    <li>Một cơ hội mình có được...</li>
    <li>Một điều giản dị mang lại niềm vui...</li>
</ul>
<p><strong>Cảm xúc hiện tại:</strong> ...</p>
        `
    },
    // --- THINKING & STRATEGY ---
    {
        id: 'five-whys',
        name: '5 Tầng Tại Sao (5 Whys)',
        description: 'Tìm ra nguyên nhân gốc rễ của vấn đề.',
        content: `
<h2>❓ 5 Tầng Tại Sao</h2>
<p><strong>Vấn đề:</strong> ...</p>
<ol>
    <li>Tại sao điều đó xảy ra? <br><em>Trả lời:</em> ...</li>
    <li>Tại sao (nguyên nhân trên) lại xảy ra? <br><em>Trả lời:</em> ...</li>
    <li>Tại sao? <br><em>Trả lời:</em> ...</li>
    <li>Tại sao? <br><em>Trả lời:</em> ...</li>
    <li>Tại sao? (Nguyên nhân gốc rễ) <br><em>Trả lời:</em> ...</li>
</ol>
<p><strong>Giải pháp:</strong> ...</p>
        `
    },
    {
        id: 'first-principles',
        name: 'Tư Duy Nguyên Bản',
        description: 'Phá vỡ vấn đề thành các thành phần cơ bản nhất.',
        content: `
<h2>⚛️ Tư Duy Nguyên Bản (First Principles)</h2>
<p><strong>Vấn đề/Giả định:</strong> ...</p>
<p><strong>Deconstruction (Phân rã):</strong></p>
<ul>
    <li>Sự thật cơ bản 1: ...</li>
    <li>Sự thật cơ bản 2: ...</li>
</ul>
<p><strong>Reconstruction (Tái cấu trúc):</strong> Nếu mình xây dựng lại từ đầu dựa trên các sự thật này, giải pháp sẽ trông như thế nào?</p>
        `
    },
    {
        id: 'inversion',
        name: 'Tư Duy Ngược (Inversion)',
        description: 'Tránh thất bại thay vì cố gắng thành công.',
        content: `
<h2>🔄 Tư Duy Ngược</h2>
<p><strong>Mục tiêu:</strong> ...</p>
<p><strong>Làm thế nào để đảm bảo THẤT BẠI thảm hại?</strong></p>
<ul>
    <li>...</li>
    <li>...</li>
</ul>
<p><strong>Làm thế nào để tránh những điều trên?</strong></p>
        `
    },

    // --- EMOTIONAL REGULATION ---
    {
        id: 'cbt-abc',
        name: 'Mô Hình ABC (CBT)',
        description: 'Phân tích và thay đổi niềm tin tiêu cực.',
        content: `
<h2>🧠 Mô Hình ABC</h2>
<p><strong>A (Activating Event) - Sự kiện kích hoạt:</strong> Điều gì đã xảy ra?</p>
<p><strong>B (Beliefs) - Niềm tin:</strong> Mình đã nghĩ gì về nó? (Suy nghĩ tự động)</p>
<p><strong>C (Consequences) - Hậu quả:</strong> Mình cảm thấy/hành động ra sao?</p>
<p><strong>D (Dispute) - Phản biện:</strong> Niềm tin đó có hoàn toàn đúng không? Bằng chứng là gì?</p>
<p><strong>E (Effective New Belief) - Niềm tin mới hiệu quả hơn:</strong> ...</p>
        `
    },

    // --- REVIEWS ---
    {
        id: 'weekly-review',
        name: 'Tổng Kết Tuần',
        description: 'Nhìn lại tuần qua và lên kế hoạch tuần tiếp.',
        content: `
<h2>📅 Tổng Kết Tuần</h2>
<p><strong>1. Thắng lợi lớn nhất tuần qua?</strong></p>
<p><strong>2. Điều gì chưa hoàn thành/thất bại? Tại sao?</strong></p>
<p><strong>3. Bài học rút ra?</strong></p>
<p><strong>4. Kế hoạch tuần tới:</strong></p>
<ul>
    <li>Ưu tiên 1: ...</li>
    <li>Ưu tiên 2: ...</li>
    <li>Ưu tiên 3: ...</li>
</ul>
        `
    },
    {
        id: 'decision-matrix',
        name: 'Ma Trận Quyết Định',
        description: 'Phân tích lựa chọn khó khăn.',
        content: `
<h2>⚖️ Ma Trận Quyết Định</h2>
<p><strong>Quyết định cần đưa ra:</strong> ...</p>
<table style="width:100%; border-collapse: collapse; border: 1px solid white;">
  <tr>
    <th style="border: 1px solid white; padding: 5px;">Lựa Chọn</th>
    <th style="border: 1px solid white; padding: 5px;">Điểm Mạnh (Pros)</th>
    <th style="border: 1px solid white; padding: 5px;">Điểm Yếu (Cons)</th>
    <th style="border: 1px solid white; padding: 5px;">Hậu Quả (Cấp 2)</th>
  </tr>
  <tr>
    <td style="border: 1px solid white; padding: 5px;">A: ...</td>
    <td style="border: 1px solid white; padding: 5px;">...</td>
    <td style="border: 1px solid white; padding: 5px;">...</td>
    <td style="border: 1px solid white; padding: 5px;">...</td>
  </tr>
  <tr>
    <td style="border: 1px solid white; padding: 5px;">B: ...</td>
    <td style="border: 1px solid white; padding: 5px;">...</td>
    <td style="border: 1px solid white; padding: 5px;">...</td>
    <td style="border: 1px solid white; padding: 5px;">...</td>
  </tr>
</table>
<p><strong>Trực giác mách bảo gì?</strong> ...</p>
        `
    }
];
