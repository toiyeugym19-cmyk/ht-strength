# 🧠 MEMBER AUTOMATION SYSTEM v2.0 - "1 TỶ TASKS" EDITION

## 🚀 TỔNG QUAN

Hệ thống Member Automation v2.0 là một **bộ não AI siêu mạnh** với **50+ kế hoạch tự động** được thiết kế để quản lý toàn bộ vòng đời hội viên - từ thu hút, gắn kết, đến giữ chân và tái kích hoạt.

### ⚡ Điểm Nổi Bật

- **50+ Kế Hoạch Tự Động** chia thành 10 categories
- **n8n Integration** - Kết nối trực tiếp với n8n workflows
- **Real-time Dashboard** - Theo dõi 12+ metrics live
- **AI Insights** - Dự đoán churn, gợi ý workout, phòng ngừa chấn thương
- **Task Management** - Tự động tạo tasks cho nhân viên

## 📊 KIẾN TRÚC HỆ THỐNG

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MEMBER AUTOMATION ENGINE v2.0                     │
│                        🧠 Bộ Não Trung Tâm                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     10 CATEGORIES                            │    │
│  ├──────────┬──────────┬──────────┬──────────┬──────────┬──────┤    │
│  │RETENTION │ACQUISITION│ENGAGEMENT│ PAYMENT  │ANALYTICS │      │    │
│  │   (12)   │    (8)    │   (10)   │   (6)    │   (6)    │      │    │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │    │
│  │OPERATIONS│MARKETING │ LOYALTY  │COMPLIANCE│AI INSIGHTS│      │    │
│  │   (6)    │    (4)    │   (4)    │   (2)    │   (4)    │      │    │
│  └──────────┴──────────┴──────────┴──────────┴──────────┴──────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    n8n WEBHOOK LAYER                         │    │
│  │   🔗 50+ Workflow IDs • Real-time Trigger • Execution Log   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    ACTION DISPATCHER                         │    │
│  │  📱 SMS │ ✉️ Email │ 📲 Zalo │ 🔔 Push │ 📞 Call │ 🎁 Discount│    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 📋 DANH SÁCH 50+ KẾ HOẠCH TỰ ĐỘNG

### 🔴 NHÓM 1: GIỮ CHÂN HỘI VIÊN (RETENTION) - 12 Plans

| ID | Tên Tiếng Việt | Trigger | Action | Priority |
|---|---|---|---|---|
| retention_001 | ⏰ Thẻ Hết Hạn 7 Ngày | 7 ngày trước | SMS + Zalo | HIGH |
| retention_002 | 🔔 Thẻ Hết Hạn 3 Ngày | 3 ngày trước | Gọi điện | CRITICAL |
| retention_003 | 🚨 Thẻ Hết Hạn Hôm Nay | Hôm nay | Alert Manager | CRITICAL |
| retention_004 | 🎁 Tái Kích Hoạt 7 Ngày | 7 ngày sau hết hạn | Giảm 15% | HIGH |
| retention_005 | 💎 Tái Kích Hoạt 14 Ngày | 14 ngày sau | Giảm 20% | HIGH |
| retention_006 | 🏆 Ưu Đãi Cuối Cùng | 30 ngày sau | Giảm 30% + 1 tháng | CRITICAL |
| retention_007 | 😴 Vắng 7 Ngày | Không tập 7 ngày | Push nhẹ | MEDIUM |
| retention_008 | 📞 Vắng 14 Ngày | Không tập 14 ngày | Task gọi điện | HIGH |
| retention_009 | 🚨 Vắng 21 Ngày | Không tập 21 ngày | Alert Manager | CRITICAL |
| retention_010 | 🤖 AI Phát Hiện Rủi Ro | Score < 30 | Alert + Suggestions | CRITICAL |
| retention_011 | 💎 Ngăn Hạ Gói | Yêu cầu downgrade | Ưu đãi 20% | HIGH |
| retention_012 | ❄️ Theo Dõi Đóng Băng | 3 ngày trước hết freeze | Gọi điện | MEDIUM |

### 🟢 NHÓM 2: THU HÚT MỚI (ACQUISITION) - 8 Plans

| ID | Tên Tiếng Việt | Trigger | Action | Priority |
|---|---|---|---|---|
| acquisition_001 | 🎉 Chào Mừng Ngày 0 | Vừa đăng ký | Email + PDF Guide | HIGH |
| acquisition_002 | 💪 Ngày 1 - Tặng Buổi PT | 1 ngày sau | SMS PT miễn phí | HIGH |
| acquisition_003 | 🏋️ Ngày 3 - Mời Lớp Học | 3 ngày sau | Gợi ý class | MEDIUM |
| acquisition_004 | 📞 Ngày 7 - Hỏi Thăm | 7 ngày sau | Gọi điện | HIGH |
| acquisition_005 | ⏰ Dùng Thử Còn 2 Ngày | 2 ngày trước hết trial | SMS + Promo | HIGH |
| acquisition_006 | 🎁 Hết Trial - Chuyển Đổi | 1 ngày sau hết trial | Ưu đãi 20% | CRITICAL |
| acquisition_007 | 👫 Kích Hoạt Giới Thiệu | 10+ check-ins | Push referral | MEDIUM |
| acquisition_008 | 🏆 Giới Thiệu Thành Công | Bạn bè đăng ký | Thông báo reward | HIGH |

### 🔵 NHÓM 3: GẮN KẾT (ENGAGEMENT) - 10 Plans

| ID | Tên Tiếng Việt | Trigger | Action | Priority |
|---|---|---|---|---|
| engagement_001 | 🎂 Chúc Mừng Sinh Nhật | Ngày sinh nhật | SMS + 1 PT miễn phí | HIGH |
| engagement_002 | 🔥 Chuỗi 7 Ngày | 7 ngày liên tiếp | Push + Smoothie | MEDIUM |
| engagement_003 | 💪 Chuỗi 14 Ngày | 14 ngày liên tiếp | Push + Khăn gym | MEDIUM |
| engagement_004 | 🏆 Chuỗi 30 Ngày | 30 ngày liên tiếp | Push + 1 PT | HIGH |
| engagement_005 | 👑 Chuỗi 100 Ngày - VIP | 100 ngày liên tiếp | Auto VIP Upgrade | CRITICAL |
| engagement_006 | 🎯 50 Lần Check-in | Đạt 50 lần | Push celebration | MEDIUM |
| engagement_007 | 🌟 100 Lần Check-in | Đạt 100 lần | Badge Centurion | HIGH |
| engagement_008 | ⏰ Gợi Ý Đổi Giờ | Giờ cao điểm | Push suggestion | LOW |
| engagement_009 | 🏋️ Gợi Ý Lớp Học | 20+ gym, 0 class | Push recommend | LOW |
| engagement_010 | 🎊 Lớp Học Đầu Tiên | Tham gia class đầu | Push congrats | MEDIUM |

### 💳 NHÓM 4: THANH TOÁN (PAYMENT) - 6 Plans

| ID | Tên Tiếng Việt | Trigger | Action | Priority |
|---|---|---|---|---|
| payment_001 | 💳 Thanh Toán Còn 7 Ngày | 7 ngày trước hạn | SMS reminder | MEDIUM |
| payment_002 | ⚠️ Thanh Toán Còn 3 Ngày | 3 ngày trước hạn | SMS + Link | HIGH |
| payment_003 | 🚨 Quá Hạn Thanh Toán | Quá hạn 1 ngày | Gọi điện | CRITICAL |
| payment_004 | 📞 Quá Hạn 7 Ngày | Quá hạn 7 ngày | Task thu nợ | CRITICAL |
| payment_005 | ✅ Gia Hạn Tự Động OK | Auto-renewal thành công | Email confirm | MEDIUM |
| payment_006 | ❌ Gia Hạn Thất Bại | Auto-renewal fail | Gọi điện khẩn | CRITICAL |

### 📈 NHÓM 5: PHÂN TÍCH (ANALYTICS) - 6 Plans

| ID | Tên Tiếng Việt | Trigger | Action | Priority |
|---|---|---|---|---|
| analytics_001 | 📊 Báo Cáo Ngày | 22:00 hàng ngày | Email report | MEDIUM |
| analytics_002 | 📈 Báo Cáo Tuần | Chủ nhật 20:00 | Email report | HIGH |
| analytics_003 | 💰 Báo Cáo Doanh Thu Tháng | Cuối tháng 23:00 | Email report | HIGH |
| analytics_004 | 📉 Cảnh Báo Churn Cao | Churn > 15% | Alert critical | CRITICAL |
| analytics_005 | 📉 Cảnh Báo Lượt Tập Thấp | < 70% trung bình | Alert warning | MEDIUM |
| analytics_006 | 📈 Cảnh Báo Quá Tải | > 90% capacity | Alert + Limit | HIGH |

### ⚙️ NHÓM 6: VẬN HÀNH (OPERATIONS) - 6 Plans

| ID | Tên Tiếng Việt | Trigger | Action | Priority |
|---|---|---|---|---|
| operations_001 | 🔧 Bảo Trì Thiết Bị | Đến hạn bảo trì | Task maintenance | HIGH |
| operations_002 | 👤 Nhắc Lịch Nhân Viên | 1h trước ca | Push reminder | MEDIUM |
| operations_003 | 🏋️ Cảnh Báo Lớp Đầy | Class >= 90% | Alert info | LOW |
| operations_004 | 💪 Nhắc Buổi PT | 2h trước buổi | SMS reminder | HIGH |
| operations_005 | ❌ PT Vắng Mặt | HV không đến PT | Gọi điện | HIGH |
| operations_006 | 🔐 Nhắc Trả Tủ | 3 ngày trước hết | SMS reminder | MEDIUM |

### 📣 NHÓM 7: MARKETING (MARKETING) - 4 Plans

| ID | Tên Tiếng Việt | Trigger | Action | Priority |
|---|---|---|---|---|
| marketing_001 | 🌸 Chiến Dịch Theo Mùa | Đầu mùa | Email campaign | MEDIUM |
| marketing_002 | ⚡ Flash Sale | Flash sale active | Push urgent | HIGH |
| marketing_003 | ⬆️ Gợi Ý Nâng Cấp | 5+ check-ins/tuần | Email suggestion | MEDIUM |
| marketing_004 | 📝 Khảo Sát NPS | Mỗi 30 check-ins | Email survey | LOW |

### ⭐ NHÓM 8: LOYALTY (LOYALTY) - 4 Plans

| ID | Tên Tiếng Việt | Trigger | Action | Priority |
|---|---|---|---|---|
| loyalty_001 | 🎁 Đủ Điểm Đổi Quà | Đạt threshold | Push notification | MEDIUM |
| loyalty_002 | 🎉 Kỷ Niệm 1 Năm | 365 ngày | Giảm 30% | HIGH |
| loyalty_003 | 👑 Nhắc Quyền Lợi VIP | VIP có benefit chưa dùng | Push reminder | HIGH |
| loyalty_004 | ⏰ Điểm Sắp Hết Hạn | 7 ngày trước hết | SMS reminder | HIGH |

### 📋 NHÓM 9: TUÂN THỦ (COMPLIANCE) - 2 Plans

| ID | Tên Tiếng Việt | Trigger | Action | Priority |
|---|---|---|---|---|
| compliance_001 | 🏥 Nhắc Khám Sức Khỏe | 180 ngày từ lần cuối | SMS reminder | MEDIUM |
| compliance_002 | 📄 Gia Hạn Hợp Đồng | 14 ngày trước hết | Gọi điện | HIGH |

### 🤖 NHÓM 10: AI INSIGHTS (AI_INSIGHTS) - 4 Plans

| ID | Tên Tiếng Việt | Trigger | Action | Priority |
|---|---|---|---|---|
| ai_001 | 🤖 AI Gợi Ý Bài Tập | Goal stalled | Push personalized | MEDIUM |
| ai_002 | 📊 AI Phân Tích Tiến Độ | Chủ nhật | Email + Charts | MEDIUM |
| ai_003 | ⚠️ AI Cảnh Báo Chấn Thương | Overtraining > 80 | Alert + Notify PT | HIGH |
| ai_004 | 📅 AI Lịch Thông Minh | Schedule không nhất quán | Push suggestion | LOW |

## 🔌 TÍCH HỢP n8n

### Webhook Configuration

```yaml
# .env
VITE_N8N_URL=http://localhost:5678

# Webhook Pattern
POST /webhook/{workflow_id}

# Example: Expiry Alert
POST /webhook/wf_expiry_7d
{
  "plan_id": "retention_001",
  "member_id": "mem_123",
  "member_name": "Nguyễn Văn A",
  "trigger_type": "membership_status",
  "action_type": "sms_notification",
  "payload": {
    "template": "expiry_7days",
    "channels": ["sms", "zalo"]
  }
}
```

### n8n Workflow IDs

| Category | Workflow IDs |
|----------|--------------|
| Retention | wf_expiry_7d, wf_expiry_3d, wf_expiry_today, wf_winback_7d, wf_winback_14d, wf_winback_30d, wf_inactive_7d, wf_inactive_14d, wf_inactive_21d, wf_ai_risk |
| Acquisition | wf_welcome_d0, wf_welcome_d1, wf_welcome_d3, wf_welcome_d7, wf_trial_end, wf_trial_convert, wf_referral |
| Engagement | wf_birthday, wf_streak_7, wf_streak_14, wf_streak_30, wf_streak_100, wf_milestone_50, wf_milestone_100 |
| Payment | wf_payment_7d, wf_payment_3d, wf_payment_overdue, wf_debt_7d, wf_renewal_success, wf_renewal_failed |
| Analytics | wf_report_daily, wf_report_weekly, wf_report_monthly, wf_churn_alert |

## 📁 CẤU TRÚC FILE

```
src/
├── store/
│   └── useMemberAutomationStore.ts  # 50+ plans, types, store
├── components/
│   ├── MemberAutomationEngine.tsx   # Engine v2.0 + n8n integration
│   └── MemberAutomationPanel.tsx    # Dashboard + Settings
└── pages/
    └── MembersPage.tsx              # Automation tab
```

## 📊 DASHBOARD METRICS

Dashboard hiển thị 12+ metrics real-time:

1. **Hết hạn hôm nay** - Cần gia hạn ngay
2. **Hết hạn tuần này** - Cần liên hệ
3. **HV rủi ro cao** - AI phát hiện
4. **Đăng ký mới** - 7 ngày gần nhất
5. **Sinh nhật hôm nay** - Cần chúc mừng
6. **n8n Executions** - Workflow đã chạy
7. **Cần gọi điện** - Tasks pending
8. **Thanh toán chờ** - Quá hạn
9. **HV không hoạt động** - 14+ ngày vắng
10. **VIP Members** - Streak 30+ hoặc 100+ check-ins
11. **Tasks hoàn thành** - Hôm nay
12. **Gia hạn hôm nay** - Đã xử lý

## 🎯 SỬ DỤNG

### Truy Cập

1. Vào `/members`
2. Click **"Bộ Não Tự Động"** ở sidebar
3. Xem Dashboard với stats real-time
4. Quản lý plans trong Settings

### Quản Lý Kế Hoạch

- **Filter by category**: Click các nút category để lọc
- **Search**: Tìm kiếm theo tên hoặc mô tả
- **Toggle plan**: Click nút Power để bật/tắt
- **View details**: Click vào plan để xem chi tiết
- **Enable/Disable all**: Nút bật/tắt tất cả

### Theo Dõi

- **Activity Log**: Xem tất cả actions đã thực hiện
- **n8n Badge**: Biểu tượng tím cho plans có n8n
- **Priority Badge**: Màu sắc theo mức độ ưu tiên
- **Trigger Count**: Số lần đã kích hoạt

## 🔧 MỞ RỘNG

### Thêm Plan Mới

```typescript
{
    id: 'custom_001',
    name: 'Custom Plan',
    nameVi: '🎯 Kế Hoạch Tùy Chỉnh',
    description: 'Mô tả kế hoạch',
    triggerType: 'member_profile',
    triggerCondition: 'custom_field === true',
    actionType: 'push_notification',
    actionPayload: { template: 'custom' },
    enabled: true,
    triggerCount: 0,
    category: 'engagement',
    priority: 'medium',
    n8nWorkflowId: 'wf_custom'
}
```

### Tùy Chỉnh Engine Interval

```typescript
// MemberAutomationEngine.tsx
const ENGINE_INTERVAL = 5 * 60 * 1000; // 5 phút (mặc định)
```

## 📝 CHANGELOG

- **v2.0** (2026-01-31): 
  - 50+ kế hoạch tự động
  - 10 categories
  - n8n webhook integration
  - 12+ dashboard metrics
  - AI Insights category
  - Enhanced task management
