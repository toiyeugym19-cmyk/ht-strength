# Chiến Lược Tự Động Hóa Member Experience Pro (n8n Powered)

Tài liệu này định nghĩa các luồng tự động hóa (Workflows) cao cấp nhằm tối ưu hóa trải nghiệm hội viên và vận hành phòng tập, loại bỏ các tác vụ thủ công nhàm chán.

## 1. Nguyên Tắc Cốt Lõi (Core Principles)
*   **Zero-Touch Operation:** Những việc lặp lại phải được tự động hóa 100%.
*   **Hyper-Personalization:** Mọi thông điệp gửi đi phải cá nhân hóa (Tên, Thói quen tập, Mục tiêu).
*   **Proactive Care:** Hệ thống phát hiện vấn đề trước khi hội viên phàn nàn.

## 2. Các Kịch Bản Tự Động Hóa (Automation Scenarios)

### Nhóm A: Chăm Sóc & Giữ Chân (Retention & Care)
1.  **"Cú Hích" Động Lực (The Motivation Nudge)**
    *   **Trigger:** Hội viên không đến tập trong 5 ngày liên tiếp.
    *   **Action:** Gửi tin nhắn Zalo/SMS nhẹ nhàng: *"Chào [Tên], Gym nhớ bạn! Đừng để chuỗi tập luyện bị ngắt quãng nhé. Hẹn gặp bạn hôm nay!"*
    *   **Goal:** Kéo hội viên quay lại trước khi họ hình thành thói quen lười biếng.

2.  **Chúc Mừng Thành Tựu (Achievement Unlock)**
    *   **Trigger:** Hội viên hoàn thành buổi tập thứ 10, 50, 100.
    *   **Action:** Gửi thiệp chúc mừng điện tử + Cộng điểm thưởng (Loyalty Points).
    *   **Goal:** Gamification hóa quá trình tập luyện.

3.  **Cảnh Báo Rủi Ro (Risk Guardian)**
    *   **Trigger:** AI chấm điểm `riskLevel` > 80% (Dựa trên tần suất giảm, thái độ).
    *   **Action:** Tạo Task cho Quản lý/Sale: *"Gọi chăm sóc khách hàng VIP [Tên] ngay. Nguy cơ rời bỏ cao."*
    *   **Goal:** Giữ chân khách hàng VIP kịp thời.

### Nhóm B: Vận Hành Thông Minh (Smart Operations)
4.  **Lời Chúc Sinh Nhật Tự Động (Birthday Delight)**
    *   **Trigger:** 09:00 AM ngày sinh nhật.
    *   **Action:** Gửi Voucher giảm giá gia hạn + Lời chúc cá nhân hóa.
    *   **Goal:** Tạo thiện cảm và upsell khéo léo.

5.  **Nhắc Gia Hạn Thông Minh (Smart Renewal)**
    *   **Trigger:** Gói tập còn 7 ngày và 3 ngày.
    *   **Action:** Gửi thông báo nhắc nhở kèm ưu đãi nếu gia hạn ngay hôm nay. Hủy gửi nếu đã gia hạn.
    *   **Goal:** Đảm bảo dòng tiền ổn định.

6.  **Báo Cáo Sức Khỏe Định Kỳ (Weekly Health Digest)**
    *   **Trigger:** 08:00 AM mỗi sáng thứ 2.
    *   **Action:** Gửi tóm tắt tuần qua cho hội viên: *"Tuần rồi bạn đã tập 4 buổi, đốt cháy ~2000 calo. Tuyệt vời!"*
    *   **Goal:** Giúp hội viên thấy được giá trị của việc đi tập.

## 3. Blacklist Features (Đã loại bỏ & Cấm thêm lại)
*   Quản lý Lịch tập thủ công.
*   Quản lý Hợp đồng giấy tờ phức tạp.
*   Thanh toán/Hóa đơn (Xử lý qua phần mềm kế toán riêng, chỉ sync trạng thái).
*   Quản lý PT (Tập trung vào trải nghiệm Hội viên).

## 4. Kiến Trúc Kỹ Thuật (Simplified)
*   **Source of Truth:** Ứng dụng này (Members Store).
*   **Processor:** n8n (Xử lý logic, điều kiện, filters).
*   **Channels:** Zalo OA, Email (SendGrid), Telegram Bot (Internal).
