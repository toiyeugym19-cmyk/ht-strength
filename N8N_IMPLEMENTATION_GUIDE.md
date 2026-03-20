# 🧠 N8N IMPLEMENTATION GUIDE - HƯỚNG DẪN TRIỂN KHAI CHI TIẾT

## 📋 MỤC LỤC
1. [Cấu Trúc Dữ Liệu Cần Thiết](#1-cấu-trúc-dữ-liệu-cần-thiết)
2. [Xử Lý Thiếu Dữ Liệu](#2-xử-lý-thiếu-dữ-liệu)
3. [Theo Dõi Sức Khỏe & Chỉ Số](#3-theo-dõi-sức-khỏe--chỉ-số)
4. [Workflows Chi Tiết](#4-workflows-chi-tiết)
5. [Cảnh Báo & Phân Tích](#5-cảnh-báo--phân-tích)

---

## ⚡ TÍNH NĂNG ĐÃ TRIỂN KHAI TRONG APP

### Tab "Theo Dõi Sức Khỏe" (Health) - MỚI THÊM

Dashboard theo dõi sức khỏe hội viên với các chức năng:

✅ **6 Stats Cards**:
- Tổng HV Active
- Đã Đo Chỉ Số (%)
- Tiến Bộ Tích Cực
- Cần Quan Tâm
- Sinh Nhật Hôm Nay
- Thiếu Ngày Sinh (cảnh báo)

✅ **Cảnh báo thiếu dữ liệu**: Tự động hiển thị khi có HV chưa có ngày sinh

✅ **Danh sách HV với search**: Hiển thị badge "Có chỉ số" / "Chưa đo" / "Thiếu DOB"

✅ **Form nhập chỉ số sức khỏe**:
- Cân nặng (kg) - bắt buộc
- Chiều cao (cm)
- % Mỡ, % Cơ
- Số đo vòng: Ngực, Eo, Hông
- Ghi chú
- Tự động tính BMI

✅ **Phân tích tiến độ**:
- So sánh với lần đo trước
- Tính điểm progress score (-100 đến +100)
- Màu indicator: xanh (tiến bộ), đỏ (cần quan tâm)

✅ **Lịch sử đo**: Hiển thị 5 records gần nhất với ngày, cân nặng, % mỡ, % cơ

✅ **2 Panel cảnh báo**:
- Tiến Bộ Tích Cực (score > 30)
- Cần Quan Tâm (score < -20)

---

## 1. CẤU TRÚC DỮ LIỆU CẦN THIẾT

### 1.1 Member Schema (Mở Rộng)

```typescript
interface Member {
  // === THÔNG TIN CƠ BẢN ===
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  
  // === THÔNG TIN THẺ TẬP ===
  membershipType: '1 Month' | '3 Months' | '6 Months' | '1 Year';
  startDate: string;      // ISO date
  endDate: string;        // ISO date
  status: 'Active' | 'Expired' | 'Pending';
  
  // === THÔNG TIN CÁ NHÂN (CẦN BỔ SUNG) ===
  dateOfBirth?: string;   // ⚠️ CÓ THỂ THIẾU - cần xử lý
  gender?: 'male' | 'female';
  address?: string;
  emergencyContact?: string;
  
  // === LỊCH SỬ CHECK-IN ===
  checkInHistory: CheckInRecord[];
  
  // === CHỈ SỐ SỨC KHỎE (MỚI) ===
  healthMetrics: HealthMetrics[];
  
  // === ĐÁNH GIÁ & GHI CHÚ ===
  notes?: string;
  tags?: string[];         // VD: ['VIP', 'PT Client', 'New']
  riskLevel?: 'low' | 'medium' | 'high';
}

interface CheckInRecord {
  id: string;
  date: string;           // ISO datetime
  type: 'Gym Access' | 'PT' | 'Class';
  duration?: number;      // phút tập
  trainer?: string;
}

// === CHỈ SỐ SỨC KHỎE ===
interface HealthMetrics {
  id: string;
  recordDate: string;     // Ngày đo
  recordedBy: string;     // PT/Staff đo
  
  // Chỉ số cơ bản
  weight: number;         // kg
  height?: number;        // cm (đo 1 lần)
  bmi?: number;           // tính tự động
  bodyFat?: number;       // % mỡ
  muscleMass?: number;    // % cơ
  
  // Số đo vòng (cm)
  chest?: number;
  waist?: number;
  hips?: number;
  thigh?: number;
  arm?: number;
  
  // Chỉ số thể lực
  restingHeartRate?: number;
  bloodPressure?: string; // "120/80"
  
  // Ghi chú PT
  notes?: string;
  goals?: string[];       // Mục tiêu: ['Giảm cân', 'Tăng cơ']
}
```

---

## 2. XỬ LÝ THIẾU DỮ LIỆU

### 2.1 VẤN ĐỀ: Thiếu Ngày Sinh Nhật

**Tình huống**: Dữ liệu cũ không có `dateOfBirth`, làm sao biết hôm nay ai sinh nhật?

#### GIẢI PHÁP 1: Campaign Thu Thập Dữ Liệu

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORKFLOW: DATA COLLECTION                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Schedule: Daily 8AM]                                          │
│         │                                                       │
│         ▼                                                       │
│  [Query DB: members WHERE dateOfBirth IS NULL]                  │
│         │                                                       │
│         ▼                                                       │
│  [Split: Batch of 50]                                           │
│         │                                                       │
│         ▼                                                       │
│  [Send SMS/Zalo]:                                               │
│   "Xin chào {name}! Để nhận quà sinh nhật từ Gym,               │
│    vui lòng cập nhật ngày sinh của bạn tại quầy                 │
│    hoặc reply: SINHHAT DD/MM/YYYY"                              │
│         │                                                       │
│         ▼                                                       │
│  [Webhook: Receive Reply]                                       │
│         │                                                       │
│         ▼                                                       │
│  [Parse Date from message]                                      │
│         │                                                       │
│         ▼                                                       │
│  [Update DB: SET dateOfBirth = parsed_date]                     │
│         │                                                       │
│         ▼                                                       │
│  [Notify Staff: "{name} đã cập nhật sinh nhật"]                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### GIẢI PHÁP 2: Staff Input Tại Quầy

```
┌─────────────────────────────────────────────────────────────────┐
│               WORKFLOW: CHECK-IN DATA COMPLETION                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Webhook: Member Check-in]                                     │
│         │                                                       │
│         ▼                                                       │
│  [IF: dateOfBirth IS NULL?]───YES───▶[Push to App:              │
│         │                             "Hỏi HV về sinh nhật"]    │
│         │NO                                  │                  │
│         ▼                                    ▼                  │
│  [Continue normal flow]            [Staff Input Form]           │
│                                          │                      │
│                                          ▼                      │
│                                    [Update Member DB]           │
│                                          │                      │
│                                          ▼                      │
│                                    [Thank you SMS to member]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### GIẢI PHÁP 3: AI Prediction (Backup)

```javascript
// Nếu không có ngày sinh, dựa vào các yếu tố khác:
const estimateBirthday = (member) => {
  // Từ CMND/CCCD (nếu có)
  if (member.idNumber) {
    // Format: YYMMDD...
    const dob = extractFromId(member.idNumber);
    return dob;
  }
  
  // Từ email (nếu có năm sinh trong email)
  if (member.email) {
    const yearMatch = member.email.match(/19[5-9]\d|20[0-2]\d/);
    if (yearMatch) {
      return { year: yearMatch[0], exactDate: false };
    }
  }
  
  return null; // Cần thu thập thủ công
};
```

### 2.2 WORKFLOW: Birthday Check Hàng Ngày

```
┌─────────────────────────────────────────────────────────────────┐
│                  WORKFLOW: DAILY BIRTHDAY CHECK                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Schedule: Daily 7:00 AM]                                      │
│         │                                                       │
│         ▼                                                       │
│  [Get Current Date] ─────▶ today = "01-31" (MM-DD)              │
│         │                                                       │
│         ▼                                                       │
│  [Query DB]:                                                    │
│   SELECT * FROM members                                         │
│   WHERE DATE_FORMAT(dateOfBirth, '%m-%d') = today               │
│   AND dateOfBirth IS NOT NULL                                   │
│   AND status = 'Active'                                         │
│         │                                                       │
│         ▼                                                       │
│  [IF: Count > 0?]───YES───▶[For Each Birthday Member]           │
│         │                           │                           │
│         │NO                         ▼                           │
│         ▼                  ┌────────────────────┐               │
│  [Log: No birthdays]       │ PARALLEL ACTIONS:  │               │
│                            │                    │               │
│                            │ 1. Send SMS:       │               │
│                            │    "Chúc mừng sinh │               │
│                            │    nhật {name}!    │               │
│                            │    Tặng 1 buổi PT" │               │
│                            │                    │               │
│                            │ 2. Create Task:    │               │
│                            │    "Gọi điện chúc  │               │
│                            │    sinh nhật"      │               │
│                            │                    │               │
│                            │ 3. Add Promo Code: │               │
│                            │    BDAY_{memberId} │               │
│                            │    -30% gia hạn    │               │
│                            │                    │               │
│                            │ 4. Notify Staff:   │               │
│                            │    Dashboard alert │               │
│                            └────────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. THEO DÕI SỨC KHỎE & CHỈ SỐ

### 3.1 WORKFLOW: Health Metrics Recording

```
┌─────────────────────────────────────────────────────────────────┐
│              WORKFLOW: RECORD HEALTH METRICS                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TRIGGER: [Webhook from App/Device]                             │
│           hoặc [Schedule: First visit of month]                 │
│         │                                                       │
│         ▼                                                       │
│  [Receive Data]:                                                │
│   {                                                             │
│     memberId: "M001",                                           │
│     weight: 75,                                                 │
│     bodyFat: 22,                                                │
│     muscleMass: 38,                                             │
│     chest: 95,                                                  │
│     waist: 82,                                                  │
│     recordedBy: "PT Minh"                                       │
│   }                                                             │
│         │                                                       │
│         ▼                                                       │
│  [Calculate BMI]:                                               │
│   bmi = weight / (height/100)²                                  │
│         │                                                       │
│         ▼                                                       │
│  [Get Previous Record]:                                         │
│   SELECT * FROM health_metrics                                  │
│   WHERE memberId = ? ORDER BY recordDate DESC LIMIT 1           │
│         │                                                       │
│         ▼                                                       │
│  [Calculate Changes]:                                           │
│   weightChange = current.weight - previous.weight               │
│   fatChange = current.bodyFat - previous.bodyFat                │
│   muscleChange = current.muscleMass - previous.muscleMass       │
│         │                                                       │
│         ▼                                                       │
│  [Analyze Progress]:                                            │
│   ┌─────────────────────────────────────────────┐               │
│   │ IF goal = "Giảm cân":                       │               │
│   │   positive = weightChange < 0 AND           │               │
│   │              fatChange < 0                  │               │
│   │                                             │               │
│   │ IF goal = "Tăng cơ":                        │               │
│   │   positive = muscleChange > 0 AND           │               │
│   │              fatChange <= 0                 │               │
│   │                                             │               │
│   │ IF goal = "Giữ form":                       │               │
│   │   positive = abs(weightChange) < 1 AND      │               │
│   │              fatChange <= 0                 │               │
│   └─────────────────────────────────────────────┘               │
│         │                                                       │
│         ▼                                                       │
│  [Save to DB + Set Alert Level]                                 │
│         │                                                       │
│         ▼                                                       │
│  [Branch by Result]:                                            │
│   ├── POSITIVE ──▶ [Send Congrats + Badge]                      │
│   ├── NEUTRAL ───▶ [Encourage + Tips]                           │
│   └── NEGATIVE ──▶ [Alert PT + Consultation Task]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 CHI TIẾT: Progress Analysis Rules

```javascript
// n8n Function Node: Analyze Member Progress
const analyzeProgress = (current, previous, member) => {
  const result = {
    status: 'neutral',    // 'positive' | 'neutral' | 'negative'
    score: 0,             // -100 to +100
    alerts: [],
    recommendations: []
  };
  
  // Không có dữ liệu trước đó
  if (!previous) {
    result.status = 'first_record';
    result.recommendations.push('Đây là lần đo đầu tiên, sẽ so sánh ở lần sau');
    return result;
  }
  
  const daysBetween = getDaysDiff(previous.recordDate, current.recordDate);
  const goal = member.goals?.[0] || 'general';
  
  // === TÍNH ĐIỂM THAY ĐỔI ===
  
  // 1. Cân nặng
  const weightChange = current.weight - previous.weight;
  const weightPct = (weightChange / previous.weight) * 100;
  
  if (goal === 'Giảm cân') {
    if (weightChange < -0.5) result.score += 20;
    else if (weightChange > 1) result.score -= 20;
  } else if (goal === 'Tăng cơ') {
    if (weightChange > 0.5 && current.bodyFat <= previous.bodyFat) result.score += 15;
  }
  
  // 2. Tỷ lệ mỡ
  const fatChange = current.bodyFat - previous.bodyFat;
  if (fatChange < -1) result.score += 25;
  else if (fatChange > 1) result.score -= 25;
  
  // 3. Khối lượng cơ
  const muscleChange = current.muscleMass - previous.muscleMass;
  if (muscleChange > 0.5) result.score += 20;
  else if (muscleChange < -0.5) result.score -= 15;
  
  // 4. Số đo vòng (nếu goal là giảm cân)
  if (goal === 'Giảm cân') {
    const waistChange = current.waist - previous.waist;
    if (waistChange < -1) result.score += 15;
    else if (waistChange > 1) result.score -= 10;
  }
  
  // === XÁC ĐỊNH TRẠNG THÁI ===
  
  if (result.score >= 30) {
    result.status = 'positive';
    result.alerts.push({
      type: 'success',
      message: `${member.name} đang tiến bộ tốt! Score: +${result.score}`
    });
  } else if (result.score <= -20) {
    result.status = 'negative';
    result.alerts.push({
      type: 'warning',
      message: `${member.name} cần được quan tâm! Score: ${result.score}`
    });
    result.recommendations.push('Đặt lịch tư vấn với PT');
    result.recommendations.push('Kiểm tra chế độ ăn uống');
  } else {
    result.status = 'neutral';
    if (daysBetween > 14 && result.score < 10) {
      result.alerts.push({
        type: 'info',
        message: `${member.name} không có thay đổi đáng kể sau ${daysBetween} ngày`
      });
    }
  }
  
  // === CẢNH BÁO ĐẶC BIỆT ===
  
  // BMI alerts
  if (current.bmi > 30) {
    result.alerts.push({
      type: 'health',
      message: 'BMI > 30: Cần chương trình giảm cân đặc biệt'
    });
  }
  
  // Tăng cân đột ngột
  if (weightChange > 3 && daysBetween < 14) {
    result.alerts.push({
      type: 'warning', 
      message: `Tăng ${weightChange}kg trong ${daysBetween} ngày - kiểm tra sức khỏe`
    });
  }
  
  // Giảm cơ đáng kể
  if (muscleChange < -2) {
    result.alerts.push({
      type: 'warning',
      message: `Mất ${Math.abs(muscleChange)}% cơ - có thể do nghỉ tập hoặc chế độ ăn`
    });
  }
  
  return result;
};
```

### 3.3 WORKFLOW: Weekly Health Report

```
┌─────────────────────────────────────────────────────────────────┐
│              WORKFLOW: WEEKLY HEALTH ANALYSIS                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Schedule: Every Monday 6:00 AM]                               │
│         │                                                       │
│         ▼                                                       │
│  [Query: All members with health_metrics this month]            │
│         │                                                       │
│         ▼                                                       │
│  [For Each Member]:                                             │
│         │                                                       │
│         ├── [Get all metrics last 30 days]                      │
│         │                                                       │
│         ├── [Calculate trends]:                                 │
│         │    - Weight trend (tăng/giảm/ổn định)                 │
│         │    - Fat % trend                                      │
│         │    - Muscle % trend                                   │
│         │    - Attendance frequency                             │
│         │                                                       │
│         ├── [Compare with goals]                                │
│         │                                                       │
│         └── [Generate Report Card]                              │
│                   │                                             │
│                   ▼                                             │
│  ┌─────────────────────────────────────────┐                    │
│  │         MEMBER REPORT CARD              │                    │
│  ├─────────────────────────────────────────┤                    │
│  │ Tên: Nguyễn Văn A                       │                    │
│  │ Mục tiêu: Giảm cân                      │                    │
│  │                                         │                    │
│  │ TIẾN ĐỘ TUẦN NÀY:                       │                    │
│  │ ✅ Cân nặng: 75kg → 74.2kg (-0.8kg)     │                    │
│  │ ✅ Body Fat: 24% → 23.5% (-0.5%)        │                    │
│  │ ⚠️ Muscle: 36% → 35.8% (-0.2%)          │                    │
│  │                                         │                    │
│  │ Số buổi tập: 4/7 ngày                   │                    │
│  │ Điểm tiến bộ: +35 (Tốt!)                │                    │
│  │                                         │                    │
│  │ GỢI Ý:                                  │                    │
│  │ - Tăng protein để giữ cơ                │                    │
│  │ - Thêm 1 buổi weight training           │                    │
│  └─────────────────────────────────────────┘                    │
│         │                                                       │
│         ▼                                                       │
│  [Categorize Members]:                                          │
│   ├── 🌟 POSITIVE (score > 30): Send congrats                   │
│   ├── 😐 NEUTRAL (-20 < score < 30): Encourage                  │
│   └── ⚠️ NEGATIVE (score < -20): Alert PT + Manager             │
│         │                                                       │
│         ▼                                                       │
│  [Generate Dashboard Summary]:                                  │
│   {                                                             │
│     totalMembers: 150,                                          │
│     withMetrics: 89,                                            │
│     positive: 34 (38%),                                         │
│     neutral: 42 (47%),                                          │
│     negative: 13 (15%),                                         │
│     needsAttention: [list of member IDs]                        │
│   }                                                             │
│         │                                                       │
│         ▼                                                       │
│  [Send Summary to Manager + PT Team]                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. WORKFLOWS CHI TIẾT

### 4.1 WORKFLOW: No-Progress Alert

```
┌─────────────────────────────────────────────────────────────────┐
│            WORKFLOW: NO PROGRESS DETECTION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Schedule: Daily 10:00 PM]                                     │
│         │                                                       │
│         ▼                                                       │
│  [Query Members]:                                               │
│   SELECT m.*, latest.*, previous.*                              │
│   FROM members m                                                │
│   JOIN health_metrics latest ON ...                             │
│   JOIN health_metrics previous ON ...                           │
│   WHERE:                                                        │
│     - Has at least 2 records                                    │
│     - Latest record within 7 days                               │
│     - Status = Active                                           │
│         │                                                       │
│         ▼                                                       │
│  [For Each: Calculate Change Score]                             │
│         │                                                       │
│         ▼                                                       │
│  [Filter: score < 5 AND daysSinceStart > 30]                    │
│   // Đã tập > 1 tháng nhưng không tiến bộ                       │
│         │                                                       │
│         ▼                                                       │
│  [Additional Check: Tần suất tập]                               │
│   avgVisitsPerWeek = checkIns.length / weeks                    │
│         │                                                       │
│         ▼                                                       │
│  [Categorize Issue]:                                            │
│   ├── LOW_ATTENDANCE (< 2 times/week)                           │
│   │    → "Tập ít quá, cần tăng tần suất"                        │
│   │                                                             │
│   ├── NO_PT_SESSIONS (0 PT in 2 weeks)                          │
│   │    → "Thiếu hướng dẫn chuyên môn"                           │
│   │                                                             │
│   ├── PLATEAU (> 4 weeks same metrics)                          │
│   │    → "Đang gặp plateau, cần thay đổi chương trình"          │
│   │                                                             │
│   └── WRONG_DIRECTION (metrics going wrong way)                 │
│        → "Đang đi sai hướng, cần can thiệp"                     │
│         │                                                       │
│         ▼                                                       │
│  [Create Intervention Plan]:                                    │
│   {                                                             │
│     memberId: "M001",                                           │
│     issue: "PLATEAU",                                           │
│     recommendedActions: [                                       │
│       "Schedule PT consultation",                               │
│       "Review diet plan",                                       │
│       "Change workout routine"                                  │
│     ],                                                          │
│     urgency: "medium",                                          │
│     assignTo: "PT Minh"                                         │
│   }                                                             │
│         │                                                       │
│         ▼                                                       │
│  [Notify PT + Create Task in System]                            │
│         │                                                       │
│         ▼                                                       │
│  [Schedule Follow-up in 7 days]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 WORKFLOW: Positive Progress Celebration

```
┌─────────────────────────────────────────────────────────────────┐
│            WORKFLOW: CELEBRATE PROGRESS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Trigger: After Health Metrics Record]                         │
│         │                                                       │
│         ▼                                                       │
│  [Calculate Progress Score]                                     │
│         │                                                       │
│         ▼                                                       │
│  [IF score > 30?]───NO───▶[Exit]                                │
│         │                                                       │
│         │YES                                                    │
│         ▼                                                       │
│  [Check Milestone]:                                             │
│   ├── First 5kg lost? → Badge "5kg Down!"                       │
│   ├── First month consistent? → Badge "Consistency King"        │
│   ├── Body fat < 20%? → Badge "Lean Machine"                    │
│   ├── 10 visits streak? → Badge "Dedicated"                     │
│   └── Goal achieved? → Badge "Goal Crusher"                     │
│         │                                                       │
│         ▼                                                       │
│  [Send Personalized Message]:                                   │
│   "Tuyệt vời {name}! Bạn đã {achievement}.                      │
│    Tiếp tục phát huy! 💪                                        │
│    Tặng bạn voucher giảm 20% khi mua gói PT!"                   │
│         │                                                       │
│         ▼                                                       │
│  [Post to Leaderboard (if opted-in)]                            │
│         │                                                       │
│         ▼                                                       │
│  [Award Loyalty Points: +50]                                    │
│         │                                                       │
│         ▼                                                       │
│  [Update Member Profile: Add Badge]                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. CẢNH BÁO & PHÂN TÍCH

### 5.1 Alert Dashboard Schema

```typescript
interface AlertDashboard {
  // Cảnh báo sinh nhật
  birthdaysToday: {
    members: Member[];
    missingData: number;  // Số HV chưa có ngày sinh
  };
  
  // Cảnh báo sức khỏe
  healthAlerts: {
    negative: Member[];      // Đang đi sai hướng
    plateau: Member[];       // Không thay đổi > 4 tuần
    noMeasurement: Member[]; // Chưa đo > 30 ngày
    needsConsultation: Member[];
  };
  
  // Cảnh báo hoạt động
  activityAlerts: {
    inactive7Days: Member[];
    inactive14Days: Member[];
    inactive30Days: Member[];
  };
  
  // Thành tích
  achievements: {
    positive: Member[];  // Tiến bộ tích cực
    milestones: { member: Member; badge: string }[];
    streaks: Member[];   // Check-in liên tục
  };
  
  // Tổng hợp
  summary: {
    totalActive: number;
    healthyProgress: number;
    needsAttention: number;
    dataCompleteness: number; // % HV có đủ data
  };
}
```

### 5.2 MASTER WORKFLOW: Daily Alerts

```
┌─────────────────────────────────────────────────────────────────┐
│               MASTER WORKFLOW: DAILY ALERTS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Schedule: 7:00 AM Daily]                                      │
│         │                                                       │
│         ▼                                                       │
│  [PARALLEL EXECUTION]:                                          │
│         │                                                       │
│         ├──▶ [Check Birthdays] ───────▶ birthdayAlerts          │
│         │                                                       │
│         ├──▶ [Check Expiring Members] ─▶ expiryAlerts           │
│         │                                                       │
│         ├──▶ [Check Inactive Members] ─▶ activityAlerts         │
│         │                                                       │
│         ├──▶ [Check Health Progress] ──▶ healthAlerts           │
│         │                                                       │
│         └──▶ [Check Achievements] ─────▶ achievements           │
│         │                                                       │
│         ▼                                                       │
│  [Merge All Alerts]                                             │
│         │                                                       │
│         ▼                                                       │
│  [Generate Priority Queue]:                                     │
│   1. 🔴 Critical: Expiring today, Health warnings               │
│   2. 🟡 High: Inactive 14+ days, No progress                    │
│   3. 🟢 Normal: Birthdays, Milestones                           │
│         │                                                       │
│         ▼                                                       │
│  [Distribute to Teams]:                                         │
│   ├── Reception: Check-in reminders, Data collection            │
│   ├── PT Team: Health alerts, Consultation requests             │
│   ├── Sales: Renewal opportunities                              │
│   └── Manager: Summary report                                   │
│         │                                                       │
│         ▼                                                       │
│  [Update Dashboard]                                             │
│         │                                                       │
│         ▼                                                       │
│  [Log for Analytics]                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. DATABASE QUERIES FOR CODER

### 6.1 SQL cho các trường hợp phổ biến

```sql
-- 1. Lấy sinh nhật hôm nay (có xử lý NULL)
SELECT * FROM members 
WHERE dateOfBirth IS NOT NULL 
  AND DATE_FORMAT(dateOfBirth, '%m-%d') = DATE_FORMAT(NOW(), '%m-%d')
  AND status = 'Active';

-- 2. Lấy HV chưa có ngày sinh
SELECT id, name, phone, email, createdAt 
FROM members 
WHERE dateOfBirth IS NULL;

-- 3. Lấy HV không có tiến bộ (so sánh 2 metrics gần nhất)
WITH RankedMetrics AS (
  SELECT 
    memberId,
    weight,
    bodyFat,
    muscleMass,
    recordDate,
    ROW_NUMBER() OVER (PARTITION BY memberId ORDER BY recordDate DESC) as rn
  FROM health_metrics
)
SELECT 
  m.id,
  m.name,
  latest.weight - prev.weight as weightChange,
  latest.bodyFat - prev.bodyFat as fatChange,
  latest.muscleMass - prev.muscleMass as muscleChange
FROM members m
JOIN RankedMetrics latest ON m.id = latest.memberId AND latest.rn = 1
JOIN RankedMetrics prev ON m.id = prev.memberId AND prev.rn = 2
WHERE ABS(latest.weight - prev.weight) < 0.5
  AND ABS(latest.bodyFat - prev.bodyFat) < 0.5
  AND DATEDIFF(NOW(), latest.recordDate) < 7;

-- 4. Lấy HV tiến bộ tích cực (giảm cân)
SELECT 
  m.*,
  latest.weight - prev.weight as weightLost,
  latest.bodyFat - prev.bodyFat as fatLost
FROM members m
JOIN RankedMetrics latest ON m.id = latest.memberId AND latest.rn = 1
JOIN RankedMetrics prev ON m.id = prev.memberId AND prev.rn = 2
WHERE (latest.weight - prev.weight) < -1
   OR (latest.bodyFat - prev.bodyFat) < -1;

-- 5. Lấy HV chưa đo trong 30 ngày
SELECT m.* 
FROM members m
LEFT JOIN (
  SELECT memberId, MAX(recordDate) as lastRecord
  FROM health_metrics
  GROUP BY memberId
) hm ON m.id = hm.memberId
WHERE hm.lastRecord IS NULL 
   OR DATEDIFF(NOW(), hm.lastRecord) > 30;
```

---

## 7. IMPLEMENTATION CHECKLIST

### Phase 1: Data Foundation
- [ ] Thêm field `dateOfBirth` vào Member schema
- [ ] Thêm table `health_metrics`
- [ ] Tạo form nhập chỉ số sức khỏe
- [ ] Campaign thu thập ngày sinh

### Phase 2: n8n Workflows
- [ ] Birthday check daily
- [ ] Health metrics recording
- [ ] Progress analysis
- [ ] Weekly report generation

### Phase 3: Alerts & Notifications
- [ ] Xây dựng Alert Dashboard
- [ ] Tích hợp SMS/Zalo gửi cảnh báo
- [ ] Tạo Badge & Gamification system

---

## 8. N8N WORKFLOW TEMPLATES (CÓ SẴN)

Đã tạo sẵn các file JSON Workflow để bạn có thể import trực tiếp vào n8n:

### 📁 `.agent/n8n_workflows/`

1. **`1_DateofBirth_Collection.json`**
   - **Chức năng**: Quét DB tìm HV thiếu ngày sinh -> Gửi SMS -> Nhận reply -> Update DB.
   - **Tần suất**: Chạy 8:00 AM hàng ngày (giới hạn 50 người/lần).

2. **`2_Daily_Status_Sync.json`**
   - **Chức năng**: 
     - Kiểm tra HV hết hạn (`expiryDate < today`) -> Update Status = 'Expired'.
     - Tính `Progress Score` & `Risk Level` dựa trên chỉ số sức khỏe -> Update vào Member profile.
   - **Tần suất**: Chạy 1:00 AM hàng ngày.

### ➤ Hướng dẫn Import:
1. Mở n8n Dashboard.
2. Chọn **"Add Workflow"** -> **"Import from..."**.
3. Chọn file JSON từ thư mục `.agent/n8n_workflows/`.
4. Cấu hình lại **Credentials** (MySQL, HTTP Request) cho phù hợp với môi trường của bạn.
5. **Activate** workflow!
- [ ] No-progress detection
- [ ] Positive celebration
- [ ] Data collection reminders
- [ ] Manager summary

### Phase 4: Dashboard
- [ ] Health alerts panel
- [ ] Progress leaderboard
- [ ] Data completeness indicator
- [ ] Action queue for staff

---

## 📝 GHI CHÚ CHO CODER

1. **Xử lý NULL**: Luôn check `dateOfBirth IS NOT NULL` trước khi query sinh nhật

2. **Timezone**: Đảm bảo server time = Vietnam time (UTC+7)

3. **Batch Processing**: Khi gửi SMS/Zalo, chia batch 50 để tránh rate limit

4. **Logging**: Log mọi action của n8n để debug

5. **Fallback**: Nếu n8n fail, có cơ chế retry 3 lần

6. **Privacy**: Không expose health data ra ngoài, chỉ staff authorized xem được

---

*Tài liệu này được tạo cho team development triển khai hệ thống n8n automation.*
