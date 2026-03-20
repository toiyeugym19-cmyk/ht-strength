# 🧠 N8N DATA SYNCHRONIZATION MINDMAP
## Gym Management System - Data Architecture & Workflows

---

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                           GYM MANAGEMENT SYSTEM                                  ║
║                        DATA SYNCHRONIZATION TREE                                 ║
╚══════════════════════════════════════════════════════════════════════════════════╝

                                    ┌─────────────┐
                                    │   🏋️ GYM    │
                                    │   SYSTEM    │
                                    └──────┬──────┘
                                           │
            ┌──────────────────────────────┼──────────────────────────────┐
            │                              │                              │
            ▼                              ▼                              ▼
    ┌───────────────┐              ┌───────────────┐              ┌───────────────┐
    │ 📊 DATA CHUNG │              │ 👤 DATA RIÊNG │              │ ⚡ AUTOMATION  │
    │  (Shared)     │              │  (Personal)   │              │   (n8n)       │
    └───────┬───────┘              └───────┬───────┘              └───────┬───────┘
            │                              │                              │
            ▼                              ▼                              ▼
    [Xem Section 1]                [Xem Section 2]                [Xem Section 3]
```

---

# 📊 SECTION 1: DATA CHUNG (SHARED DATA)

```
DATA CHUNG
    │
    ├── 1.1 GÓI TẬP (Packages)
    │       │
    │       ├── package_id (PK)
    │       ├── name: "Gói 1 tháng", "Gói 3 tháng"...
    │       ├── duration_days: 30, 90, 180, 365
    │       ├── price: 500000, 1200000...
    │       ├── features: ["Tập không giới hạn", "Tủ đồ miễn phí"]
    │       ├── pt_sessions_included: 0, 5, 10
    │       └── is_active: true/false
    │
    ├── 1.2 KHUYẾN MÃI (Promotions)
    │       │
    │       ├── promo_id (PK)
    │       ├── code: "FLASHSALE50", "BIRTHDAY30"
    │       ├── type: "percentage" | "fixed" | "gift"
    │       ├── value: 50 (%), 100000 (VND), "1 PT session"
    │       ├── start_date, end_date
    │       ├── usage_limit: 100
    │       ├── usage_count: 45
    │       └── applicable_packages: ["pkg_1", "pkg_2"]
    │
    ├── 1.3 HUẤN LUYỆN VIÊN (Trainers)
    │       │
    │       ├── trainer_id (PK)
    │       ├── name, phone, email, avatar
    │       ├── specialties: ["Gym", "Yoga", "Boxing"]
    │       ├── certification: ["ACE", "NASM"]
    │       ├── hourly_rate: 200000
    │       ├── commission_rate: 0.3 (30%)
    │       └── status: "available" | "busy" | "off"
    │
    ├── 1.4 LỊCH LỚP HỌC (Group Classes)
    │       │
    │       ├── class_id (PK)
    │       ├── name: "Yoga sáng", "Boxing chiều"
    │       ├── schedule: "Mon,Wed,Fri 7:00-8:00"
    │       ├── trainer_id (FK)
    │       ├── max_capacity: 20
    │       ├── room: "Phòng A", "Phòng B"
    │       └── is_active: true/false
    │
    ├── 1.5 CẦU HÌNH HỆ THỐNG (Settings)
    │       │
    │       ├── business_hours: "6:00-22:00"
    │       ├── sms_provider: "ESMS" | "Zalo ZNS"
    │       ├── webhook_urls: {...}
    │       ├── notification_templates: {...}
    │       └── automation_settings: {...}
    │
    └── 1.6 MẪU TIN NHẮN (Message Templates)
            │
            ├── template_id (PK)
            ├── name: "Chào mừng HV mới"
            ├── channel: "SMS" | "Zalo" | "Email"
            ├── content: "Xin chào {name}..."
            ├── variables: ["name", "expiry_date", "days_left"]
            └── trigger: "manual" | "auto"
```

---

# 👤 SECTION 2: DATA RIÊNG (MEMBER PERSONAL DATA)

```
DATA RIÊNG - MEMBER
    │
    ├── 2.1 THÔNG TIN CƠ BẢN (Basic Info) ⚠️ QUAN TRỌNG
    │       │
    │       ├── member_id (PK): "M001", "M002"...
    │       ├── ──────────────────────────────────────
    │       ├── name: string (BẮT BUỘC)
    │       ├── phone: string (BẮT BUỘC, unique)
    │       ├── email: string (optional)
    │       ├── avatar: string URL
    │       ├── ──────────────────────────────────────
    │       ├── 🔴 date_of_birth: string | NULL   ← THIẾU!
    │       │       │
    │       │       ├── Format: "YYYY-MM-DD" (ISO)
    │       │       ├── Example: "1990-05-15"
    │       │       ├── Used for: Birthday automation
    │       │       ├── Collection: Form nhập / SMS reply
    │       │       └── 🚨 REQUIRED for birthday workflows
    │       │
    │       ├── gender: "male" | "female" | null
    │       ├── address: string
    │       ├── emergency_contact: string
    │       ├── id_number: string (CMND/CCCD)
    │       └── created_at: datetime
    │
    ├── 2.2 THÔNG TIN THẺ TẬP (Membership)
    │       │
    │       ├── membership_type: "1 Month" | "3 Months" | "6 Months" | "1 Year"
    │       ├── package_id (FK → Packages)
    │       ├── ──────────────────────────────────────
    │       ├── join_date: string (ngày đăng ký lần đầu)
    │       ├── start_date: string (ngày bắt đầu gói hiện tại)
    │       ├── 🔴 expiry_date: string   ← QUAN TRỌNG!
    │       │       │
    │       │       ├── Format: "YYYY-MM-DD"
    │       │       ├── Calculated: start_date + package.duration_days
    │       │       └── Used for: Expiry reminder workflows
    │       │
    │       ├── status: "Active" | "Expired" | "Pending"
    │       ├── ──────────────────────────────────────
    │       ├── sessions_total: number (tổng buổi PT)
    │       ├── sessions_used: number (đã sử dụng)
    │       ├── sessions_remaining: number (còn lại)
    │       └── assigned_pt_id: string (FK → Trainers)
    │
    ├── 2.3 CHỈ SỐ SỨC KHỎE (Health Metrics) ← MỚI
    │       │
    │       ├── health_metrics: HealthMetrics[]
    │       │       │
    │       │       └── Mỗi record:
    │       │               ├── id: string
    │       │               ├── record_date: datetime
    │       │               ├── recorded_by: string (PT/Staff)
    │       │               ├── ─────────────────────────
    │       │               ├── weight: number (kg)
    │       │               ├── height: number (cm) - đo 1 lần
    │       │               ├── bmi: number (auto-calculated)
    │       │               ├── body_fat: number (%)
    │       │               ├── muscle_mass: number (%)
    │       │               ├── ─────────────────────────
    │       │               ├── chest: number (cm)
    │       │               ├── waist: number (cm)
    │       │               ├── hips: number (cm)
    │       │               ├── ─────────────────────────
    │       │               └── notes: string
    │       │
    │       ├── fitness_goals: ["Giảm cân", "Tăng cơ", "Giữ form"]
    │       ├── progress_score: number (-100 to +100)
    │       └── risk_level: "low" | "medium" | "high"
    │
    ├── 2.4 LỊCH SỬ CHECK-IN (Check-in History)
    │       │
    │       ├── check_in_history: CheckInRecord[]
    │       │       │
    │       │       └── Mỗi record:
    │       │               ├── id: string
    │       │               ├── date: datetime
    │       │               ├── type: "Gym Access" | "PT" | "Class"
    │       │               ├── trainer_name: string | null
    │       │               ├── duration: number (phút)
    │       │               └── note: string
    │       │
    │       └── last_check_in: datetime (latest)
    │
    ├── 2.5 HỢP ĐỒNG (Contracts)
    │       │
    │       ├── contracts: Contract[]
    │       │       │
    │       │       └── Mỗi record:
    │       │               ├── id: string
    │       │               ├── code: "HD-001"
    │       │               ├── package_name: string
    │       │               ├── start_date, end_date
    │       │               ├── status: "Valid" | "Expired" | "Terminated"
    │       │               └── file_url: string (PDF)
    │       │
    │       └── current_contract_id: string (FK)
    │
    ├── 2.6 THANH TOÁN (Payments)
    │       │
    │       ├── total_spending: number (tổng đã chi)
    │       ├── payment_history: Payment[]
    │       │       │
    │       │       └── Mỗi record:
    │       │               ├── id: string
    │       │               ├── date: datetime
    │       │               ├── amount: number
    │       │               ├── type: "Gia hạn" | "PT" | "Sản phẩm"
    │       │               ├── method: "Cash" | "Transfer" | "Card"
    │       │               ├── status: "paid" | "pending" | "overdue"
    │       │               └── invoice_id: string
    │       │
    │       └── outstanding_balance: number (còn nợ)
    │
    └── 2.7 METADATA & FLAGS
            │
            ├── face_id_registered: boolean
            ├── tags: ["VIP", "PT Client", "New"]
            ├── notes: string (ghi chú của staff)
            ├── ──────────────────────────────────────
            ├── sms_opt_in: boolean (đồng ý nhận SMS)
            ├── email_opt_in: boolean
            ├── last_contact_date: datetime
            ├── ──────────────────────────────────────
            ├── referral_code: string (mã giới thiệu)
            ├── referred_by: string (member_id)
            └── referral_count: number (đã giới thiệu bao nhiêu người)
```

---

# 🔴 SECTION 3: VẤN ĐỀ DỮ LIỆU THIẾU & CÁCH XỬ LÝ

```
VẤN ĐỀ DỮ LIỆU THIẾU
    │
    ├── 3.1 🔴 THIẾU NGÀY SINH (date_of_birth = NULL)
    │       │
    │       ├── Ảnh hưởng:
    │       │       ├── ❌ Không thể gửi chúc mừng sinh nhật
    │       │       ├── ❌ Không thể tạo khuyến mãi sinh nhật
    │       │       └── ❌ Không phân loại theo tuổi
    │       │
    │       ├── Giải pháp 1: THU THẬP QUA SMS
    │       │       │
    │       │       ├── [Workflow: DATA_COLLECTION_SMS]
    │       │       ├── Trigger: Daily 8AM
    │       │       ├── Query: members WHERE date_of_birth IS NULL
    │       │       ├── Action: Gửi SMS
    │       │       │   "Xin chào {name}! Để nhận quà sinh nhật,
    │       │       │    vui lòng reply: SINHHAT DD/MM/YYYY"
    │       │       ├── Webhook: Nhận reply
    │       │       └── Update: SET date_of_birth = parsed_date
    │       │
    │       ├── Giải pháp 2: THU THẬP TẠI QUẦY
    │       │       │
    │       │       ├── [Workflow: CHECK_IN_DATA_PROMPT]
    │       │       ├── Trigger: Member check-in
    │       │       ├── Check: IF date_of_birth IS NULL
    │       │       ├── Action: Push notification to Staff App
    │       │       │   "Hội viên {name} chưa có ngày sinh - hỏi cập nhật"
    │       │       └── Update: Staff nhập qua form
    │       │
    │       └── Giải pháp 3: EXTRACT TỪ CMND
    │               │
    │               ├── IF id_number IS NOT NULL
    │               ├── Parse: Extract year from CCCD format
    │               │   Ex: "079090012345" → born 1990
    │               └── Note: Chỉ có năm, không có ngày tháng
    │
    ├── 3.2 🔴 THIẾU CHỈ SỐ SỨC KHỎE (health_metrics = [])
    │       │
    │       ├── Ảnh hưởng:
    │       │       ├── ❌ Không theo dõi được tiến độ
    │       │       ├── ❌ Không biết ai cần quan tâm
    │       │       └── ❌ Không tạo được report
    │       │
    │       ├── Giải pháp 1: NHẮC ĐO ĐỊNH KỲ
    │       │       │
    │       │       ├── [Workflow: MONTHLY_MEASUREMENT_REMINDER]
    │       │       ├── Trigger: 1st of month
    │       │       ├── Query: members WHERE last_measurement > 30 days
    │       │       ├── Action: SMS + Task cho PT
    │       │       └── "Đến lịch đo chỉ số tháng này!"
    │       │
    │       └── Giải pháp 2: ĐO KHI CHECK-IN ĐẦU THÁNG
    │               │
    │               ├── [Workflow: FIRST_CHECKIN_OF_MONTH]
    │               ├── Trigger: Check-in
    │               ├── Check: IF first_checkin_this_month
    │               └── Action: Prompt PT nhập chỉ số
    │
    ├── 3.3 🔴 EXPIRY_DATE KHÔNG CHÍNH XÁC
    │       │
    │       ├── Vấn đề:
    │       │       ├── Có start_date nhưng không có expiry_date
    │       │       ├── expiry_date không khớp với package duration
    │       │       └── Gia hạn nhưng chưa update expiry_date
    │       │
    │       └── Giải pháp: AUTO-CALCULATE
    │               │
    │               ├── [Workflow: SYNC_EXPIRY_DATE]
    │               ├── Trigger: After payment / renewal
    │               ├── Logic:
    │               │   expiry_date = start_date + package.duration_days
    │               └── Validate: Chạy daily để check inconsistency
    │
    └── 3.4 🔴 STATUS KHÔNG ĐỒNG BỘ
            │
            ├── Vấn đề:
            │       ├── expiry_date đã qua nhưng status vẫn = "Active"
            │       └── Đã gia hạn nhưng status vẫn = "Expired"
            │
            └── Giải pháp: AUTO-SYNC STATUS
                    │
                    ├── [Workflow: DAILY_STATUS_SYNC]
                    ├── Trigger: Daily 12:00 AM
                    ├── Logic:
                    │   IF expiry_date < TODAY AND status = "Active"
                    │      → SET status = "Expired"
                    │   IF expiry_date >= TODAY AND status = "Expired"
                    │      → SET status = "Active"
                    └── Alert: Notify nếu có bất thường
```

---

# ⚡ SECTION 4: N8N WORKFLOWS TREE

```
N8N AUTOMATION WORKFLOWS
    │
    ├── 4.1 📅 DAILY WORKFLOWS (Chạy hàng ngày)
    │       │
    │       ├── [DAILY_00:00] Status Sync
    │       │       ├── Sync member status với expiry_date
    │       │       └── Mark expired members
    │       │
    │       ├── [DAILY_07:00] Morning Alerts
    │       │       ├── Birthday check
    │       │       ├── Expiring today
    │       │       └── Staff daily briefing
    │       │
    │       ├── [DAILY_08:00] Data Collection Campaign
    │       │       ├── SMS to members missing date_of_birth
    │       │       └── Limit: 50 SMS/day
    │       │
    │       ├── [DAILY_10:00] Reminder - Expiring Soon
    │       │       ├── 7 days before: Soft reminder
    │       │       ├── 3 days before: Urgent reminder
    │       │       └── 1 day before: Final reminder
    │       │
    │       ├── [DAILY_18:00] Inactive Member Alert
    │       │       ├── No check-in 7 days: SMS encourage
    │       │       ├── No check-in 14 days: Phone call task
    │       │       └── No check-in 30 days: At-risk flag
    │       │
    │       └── [DAILY_22:00] End of Day Report
    │               ├── Today's check-ins
    │               ├── Revenue summary
    │               └── Tomorrow's expiries
    │
    ├── 4.2 🎂 BIRTHDAY WORKFLOWS
    │       │
    │       ├── [BIRTHDAY_CHECK]
    │       │       │
    │       │       ├── Trigger: Daily 7AM
    │       │       ├── Query:
    │       │       │   SELECT * FROM members
    │       │       │   WHERE DATE_FORMAT(date_of_birth, '%m-%d')
    │       │       │         = DATE_FORMAT(NOW(), '%m-%d')
    │       │       │   AND date_of_birth IS NOT NULL
    │       │       │
    │       │       ├── IF count > 0:
    │       │       │       │
    │       │       │       ├── 1. Send SMS: "Chúc mừng sinh nhật {name}!"
    │       │       │       ├── 2. Create promo code: BDAY_{member_id}
    │       │       │       ├── 3. Notify Staff to call
    │       │       │       └── 4. Update dashboard
    │       │       │
    │       │       └── IF count = 0:
    │       │               └── Log: "No birthdays today"
    │       │
    │       ├── [BIRTHDAY_PROMO_USAGE]
    │       │       ├── Trigger: Promo code used
    │       │       ├── Check: IF code starts with "BDAY_"
    │       │       └── Action: Log + Thank you message
    │       │
    │       └── [BIRTHDAY_DATA_MISSING_ALERT]
    │               ├── Trigger: Weekly Monday
    │               ├── Query: COUNT WHERE date_of_birth IS NULL
    │               └── Report: "X hội viên chưa có ngày sinh"
    │
    ├── 4.3 💪 HEALTH TRACKING WORKFLOWS
    │       │
    │       ├── [HEALTH_METRICS_RECORDED]
    │       │       │
    │       │       ├── Trigger: Webhook from App
    │       │       ├── Receive: { member_id, weight, body_fat, ... }
    │       │       ├── Calculate: BMI, progress_score
    │       │       ├── Compare: với record trước
    │       │       │
    │       │       ├── IF progress_score > 30:
    │       │       │       ├── Status: POSITIVE
    │       │       │       ├── Send congrats SMS
    │       │       │       └── Award badge
    │       │       │
    │       │       ├── IF progress_score < -20:
    │       │       │       ├── Status: NEGATIVE
    │       │       │       ├── Alert PT
    │       │       │       └── Schedule consultation
    │       │       │
    │       │       └── ELSE:
    │       │               └── Status: NEUTRAL, log only
    │       │
    │       ├── [WEEKLY_HEALTH_REPORT]
    │       │       ├── Trigger: Monday 6AM
    │       │       ├── Generate: Report cho Manager
    │       │       │   - Total measured: X
    │       │       │   - Positive: Y
    │       │       │   - Negative: Z
    │       │       │   - Need attention: [list]
    │       │       └── Send: Email to Manager
    │       │
    │       ├── [NO_MEASUREMENT_REMINDER]
    │       │       ├── Trigger: Daily
    │       │       ├── Query: last_measurement > 30 days
    │       │       └── Action: SMS + PT task
    │       │
    │       └── [PLATEAU_DETECTION]
    │               ├── Trigger: After measurement
    │               ├── Check: No change in 4 weeks
    │               └── Action: PT consultation + new program
    │
    ├── 4.4 💰 PAYMENT & RENEWAL WORKFLOWS
    │       │
    │       ├── [PAYMENT_RECEIVED]
    │       │       ├── Trigger: Webhook from POS
    │       │       ├── Update: expiry_date, status
    │       │       ├── Generate: Invoice
    │       │       └── Send: Receipt SMS
    │       │
    │       ├── [RENEWAL_REMINDER_SEQUENCE]
    │       │       │
    │       │       ├── Day -30: "Thẻ của bạn sẽ hết hạn trong 1 tháng"
    │       │       ├── Day -14: "Còn 2 tuần, gia hạn ngay để nhận ưu đãi 10%"
    │       │       ├── Day -7:  "Chỉ còn 1 tuần! Ưu đãi 15% nếu gia hạn hôm nay"
    │       │       ├── Day -3:  "Sắp hết hạn! Liên hệ ngay: 0901234567"
    │       │       ├── Day -1:  "NGÀY CUỐI! Gia hạn để không bị gián đoạn"
    │       │       └── Day 0:   "Thẻ đã hết hạn. Gia hạn ngay để tiếp tục tập"
    │       │
    │       └── [POST_EXPIRY_WINBACK]
    │               ├── Day +3:  "Chúng tôi nhớ bạn! Ưu đãi đặc biệt 20%"
    │               ├── Day +7:  "Quay lại nào! Tặng 1 buổi PT miễn phí"
    │               └── Day +30: Mark as churned, final offer 30%
    │
    ├── 4.5 📱 CHECK-IN WORKFLOWS
    │       │
    │       ├── [CHECK_IN_RECORDED]
    │       │       ├── Trigger: Face ID / Manual check-in
    │       │       ├── Update: last_check_in, increment visits
    │       │       ├── Check: IF first visit this month → prompt measurement
    │       │       └── Check: IF date_of_birth IS NULL → prompt staff
    │       │
    │       ├── [STREAK_CELEBRATION]
    │       │       ├── Trigger: Check-in
    │       │       ├── Check: Consecutive days
    │       │       ├── IF 7 days streak: Badge + SMS
    │       │       ├── IF 30 days streak: Special reward
    │       │       └── IF 100 days streak: VIP status
    │       │
    │       └── [INACTIVE_MEMBER_SEQUENCE]
    │               ├── Day 7:  SMS encourage
    │               ├── Day 14: Staff call task
    │               ├── Day 21: Manager alert
    │               └── Day 30: At-risk flag + special offer
    │
    └── 4.6 🔔 NOTIFICATION WORKFLOWS
            │
            ├── [WELCOME_NEW_MEMBER]
            │       ├── Trigger: New member created
            │       ├── Day 0: Welcome SMS + App download link
            │       ├── Day 1: "Cách sử dụng gym hiệu quả"
            │       ├── Day 3: "Đặt lịch PT thử nghiệm miễn phí"
            │       └── Day 7: "Đánh giá trải nghiệm tuần đầu tiên"
            │
            ├── [CLASS_REMINDER]
            │       ├── Trigger: 2 hours before class
            │       ├── Query: Members registered for class
            │       └── Send: "Lớp {class_name} sẽ bắt đầu lúc {time}"
            │
            └── [PT_SESSION_REMINDER]
                    ├── Trigger: 1 day before, 2 hours before
                    ├── Query: Scheduled PT sessions
                    └── Send: "Buổi PT với {trainer_name} vào {time}"
```

---

# 🔄 SECTION 5: DATA SYNCHRONIZATION RULES

```
DATA SYNC RULES
    │
    ├── 5.1 MEMBER STATUS AUTO-SYNC
    │       │
    │       ├── Rule 1: Expiry Check
    │       │   IF expiry_date < CURRENT_DATE AND status = "Active"
    │       │   THEN SET status = "Expired"
    │       │
    │       ├── Rule 2: Renewal Check
    │       │   IF expiry_date >= CURRENT_DATE AND status = "Expired"
    │       │   THEN SET status = "Active"
    │       │
    │       └── Rule 3: Pending Check
    │           IF payment.status = "pending" AND start_date > CURRENT_DATE
    │           THEN SET status = "Pending"
    │
    ├── 5.2 EXPIRY DATE CALCULATION
    │       │
    │       ├── On new membership:
    │       │   expiry_date = start_date + package.duration_days
    │       │
    │       ├── On renewal:
    │       │   IF current_expiry >= TODAY:
    │       │       expiry_date = current_expiry + package.duration_days
    │       │   ELSE (đã hết hạn):
    │       │       expiry_date = TODAY + package.duration_days
    │       │
    │       └── On freeze (tạm dừng):
    │           expiry_date = expiry_date + freeze_days
    │
    ├── 5.3 PROGRESS SCORE CALCULATION
    │       │
    │       ├── Base score: 0
    │       │
    │       ├── Weight change (goal: giảm cân):
    │       │   weight_lost > 0.5kg: +20 points
    │       │   weight_gained > 1kg: -20 points
    │       │
    │       ├── Body fat change:
    │       │   fat_lost > 1%: +25 points
    │       │   fat_gained > 1%: -25 points
    │       │
    │       ├── Muscle mass change:
    │       │   muscle_gained > 0.5%: +20 points
    │       │   muscle_lost > 0.5%: -15 points
    │       │
    │       └── Final: Cap at -100 to +100
    │
    ├── 5.4 RISK LEVEL ASSIGNMENT
    │       │
    │       ├── HIGH RISK:
    │       │   - No check-in > 14 days
    │       │   - progress_score < -30
    │       │   - expiry_date <= TODAY + 7
    │       │
    │       ├── MEDIUM RISK:
    │       │   - No check-in 7-14 days
    │       │   - progress_score between -30 and 0
    │       │   - expiry_date <= TODAY + 30
    │       │
    │       └── LOW RISK:
    │           - All other cases
    │
    └── 5.5 DATA VALIDATION ON SAVE
            │
            ├── Phone: Must be valid VN format (10-11 digits)
            ├── Email: Optional but must be valid if provided
            ├── date_of_birth: Must be > 16 years ago
            ├── weight: Must be 30-300 kg
            ├── height: Must be 100-250 cm
            └── expiry_date: Must be >= start_date
```

---

# 📋 SECTION 6: IMPLEMENTATION CHECKLIST

```
TRIỂN KHAI DATA SYNC
    │
    ├── PHASE 1: DATA STRUCTURE (Tuần 1)
    │       │
    │       ├── [ ] Update Member schema with all fields
    │       ├── [ ] Add date_of_birth to existing forms
    │       ├── [ ] Add health_metrics table/array
    │       ├── [ ] Add expiry_date auto-calculation
    │       └── [ ] Add progress_score field
    │
    ├── PHASE 2: DATA COLLECTION (Tuần 2)
    │       │
    │       ├── [ ] Campaign thu thập ngày sinh qua SMS
    │       ├── [ ] Form nhập ngày sinh tại quầy
    │       ├── [ ] Form nhập chỉ số sức khỏe
    │       ├── [ ] Validation rules cho tất cả fields
    │       └── [ ] Migrate existing data
    │
    ├── PHASE 3: N8N WORKFLOWS (Tuần 3-4)
    │       │
    │       ├── [ ] Daily status sync workflow
    │       ├── [ ] Birthday check workflow
    │       ├── [ ] Expiry reminder sequence
    │       ├── [ ] Health tracking workflows
    │       ├── [ ] Check-in trigger workflows
    │       └── [ ] Inactive member alerts
    │
    ├── PHASE 4: DASHBOARD & ALERTS (Tuần 4)
    │       │
    │       ├── [ ] Dashboard hiển thị data completeness
    │       ├── [ ] Alert panel cho missing data
    │       ├── [ ] Report thiếu ngày sinh
    │       ├── [ ] Report chưa đo chỉ số
    │       └── [ ] Progress tracking charts
    │
    └── PHASE 5: MONITORING (Ongoing)
            │
            ├── [ ] Daily data quality report
            ├── [ ] Weekly sync status check
            ├── [ ] Monthly full audit
            └── [ ] Quarterly cleanup
```

---

# 🎯 SUMMARY: KEY DATA RELATIONSHIPS

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW DIAGRAM                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   MEMBER    │────▶│  PACKAGE    │     │   TRAINER   │     │    CLASS    │
│   (Many)    │     │   (One)     │     │   (One)     │     │   (Many)    │
└──────┬──────┘     └─────────────┘     └──────┬──────┘     └──────┬──────┘
       │                                       │                   │
       │ has many                              │ trains            │ attends
       ▼                                       ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  HEALTH     │     │  CHECK-IN   │     │ PT SESSION  │     │  CONTRACT   │
│  METRICS    │     │  RECORDS    │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       └───────────────────┴───────────────────┴───────────────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  N8N AUTOMATION │
                          │    TRIGGERS     │
                          └─────────────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│  BIRTHDAY   │          │   HEALTH    │          │   EXPIRY    │
│  WORKFLOW   │          │  WORKFLOW   │          │  WORKFLOW   │
└─────────────┘          └─────────────┘          └─────────────┘
```

---

*Document Version: 2.0*
*Last Updated: 2026-01-31*
*Author: System Architect*
