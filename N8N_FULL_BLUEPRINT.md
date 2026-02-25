# 🦅 THE MONOLITH: COMPLETE GYM AUTOMATION BLUEPRINT
> **Source Truth:** 31 Visual Assets (PNG/JPG) from `n8n/anh/`.
> **Philosophy:** Pure Training Logic. No Fluff. 1 Million Granular Steps.
> **Format:** Single Unified Masterfile.

---

## 🏛️ PART 1: STRATEGIC PLANNING (THE ARCHITECT)
*Based on logic derived from files `2.png` -> `7.png` & `db...screen.png`*

### 1.1 INITIALIZATION PROTOCOL (Khởi tạo hệ thống)
*   **Step 000,001:** System Boot -> Load User ID.
*   **Step 000,002:** Fetch Anthropometrics (Height: 175cm, Weight: 75kg, Femur_Len: 42cm).
*   **Step 000,003:** Calculate `Training_Age_Score`.
    *   Logic: `(Years_Training * 1) + (Squat_1RM / Bodyweight * 2)`.
    *   Result: If Score > 5.0 -> classification = "Advanced".
*   **Step 000,004:** Load `Injury_History_Array` (e.g., ["Left_Rotator_Cuff", "Lower_Back"]).

### 1.2 MACRO-CYCLE DESIGN (Thiết kế chu kỳ vĩ mô)
*   **Step 000,100:** Determine Goal Vector (Strength vs Hypertrophy).
*   **Step 000,101:** Set `Mesocycle_Length`.
    *   Logic: If `User_Age > 35` -> 4 Weeks (Shorter due to recovery).
    *   Logic: If `User_Age <= 35` -> 6 Weeks.
*   **Step 000,102:** Volume Landmark Calculation (MEV - MRV).
    *   Quads: Start 10 sets/week -> Cap at 18 sets/week.
    *   Chest: Start 12 sets/week -> Cap at 20 sets/week.

### 1.3 MICRO-CYCLE SPLIT (Chia lịch tuần)
*   **Step 000,200:** Resolve Frequency Constraints.
    *   Input: "User wants to train 4 days/week".
*   **Step 000,201:** Algorithm Selection.
    *   Option A: Upper / Lower / Rest / Upper / Lower.
    *   Option B: Torso / Limbs / Rest / Torso / Limbs.
*   **Step 000,202:** **Slot Filling (Điền bài tập).**
    *   Slot 1 (Compound): High Fatigue Cost.
    *   Slot 2 (Compound): Medium Fatigue Cost.
    *   Slot 3-5 (Isolation): Low Fatigue Cost.

---

## ⚔️ PART 2: SESSION EXECUTION (THE COMMANDER)
*Based on logic derived from files `8.jpg` to `25.jpg`*

### 2.1 PRE-WORKOUT READINESS (Kiểm tra sẵn sàng)
*   **Step 100,001:** HRV Sync.
*   **Step 100,002:** CNS Readiness Score Calculation.
    *   Formula: `(Current_HRV / Baseline_HRV) * 100`.
*   **Step 100,003:** Auto-Regulate Session Intensity.
    *   Case: Score < 80% -> Action: Reduce all working weights by 10%.
    *   Case: Score < 60% -> Action: Switch to "Deload Session".

### 2.2 WARM-UP GENERATOR (Khởi động thông minh)
*   **Step 100,100:** Scan "Daily_Joint_Load".
    *   Ex: Today involves "Heavy Bench Press".
*   **Step 100,101:** Activate Protocols.
    *   Step A: Thoracic Spine Mobility (Extension).
    *   Step B: Rotator Cuff Stability (External Rotation).
*   **Step 100,102:** Ramp-up Sets Calculation (Tăng tạ khởi động).
    *   Target: 100kg.
    *   Set 1: Bar x 10.
    *   Set 2: 40kg x 5.
    *   Set 3: 60kg x 3.
    *   Set 4: 80kg x 1.
    *   Set 5: 90kg x 1 (Potentiation Rep).

### 2.3 THE SET LOGGER ALGORITHM (Ghi nhận set tập)
*Mô phỏng chi tiết [Img 16.jpg]*
*   **Step 200,000:** **Input Validation Phase.**
    *   Check 1: `Weight > 0`.
    *   Check 2: `Reps > 0`.
    *   Check 3: `RPE` within 1-10 scale.
*   **Step 200,001:** **E1RM Calculation (Estimated 1-Rep Max).**
    *   Formula (Epley): `Weight * (1 + Reps/30)`.
    *   Example: 100kg * (1 + 5/30) = 116.6kg.
*   **Step 200,002:** **Progressive Overload Logic.**
    *   Condition: If `New_E1RM > Previous_Session_E1RM`.
    *   Action: Trigger `Dopamine_Reward_UI` (Visual Confetti).
    *   Action: Mark "Progress Made".
*   **Step 200,003:** **RPE Check Logic.**
    *   Target RPE: 8.
    *   Actual RPE: 9.5 (Overshot).
    *   Action: **Decrease Next Set Load** by 5% to prevent burnout.

### 2.4 REST TIMER LOGIC (Nghỉ giữa hiệp)
*Mô phỏng chi tiết [Img 17.jpg]*
*   **Step 200,100:** Identify Exercise Type.
    *   Type: "Deadlift" (High CNS Demand).
*   **Step 200,101:** Set Timer Duration = 180s.
*   **Step 200,102:** Haptic Feedback Triggers.
    *   @ 120s: "Start Mental Prep".
    *   @ 160s: "Approach Bar".
    *   @ 180s: "LIFT!".

---

## 🔬 PART 3: ADVANCED DATA ANALYTICS (THE SCIENTIST)
*Based on logic derived from files `26.jpg` to `31.jpg`*

### 3.1 VOLUME LOAD ANALYSIS
*   **Step 500,001:** Sum Tonnage (Total Kg lifted).
*   **Step 500,002:** Breakdown by Muscle Group.
    *   Chest Tonnage: 5000kg.
    *   Triceps Tonnage: 2000kg.
*   **Step 500,003:** Compare vs MRV Limit.
    *   If `Chest_Tonnage > Chest_MRV_Cap` -> **Alert:** "Overreaching detected. Risk of Junk Volume."

### 3.2 FATIGUE MANAGEMENT SYSTEM
*   **Step 500,100:** Calculate "Acute Cardio-Workload Ratio" (ACWR).
*   **Step 500,101:** Monitor Joint Stress Accumulation.
    *   Elbow Stress Meter: 85%.
*   **Step 500,102:** Proactive deload trigger.
    *   If `Stress > 90%` -> Force "Light Session" next Push Day.

### 3.3 PLATEAU BREAKER ALGORITHM (Phá chững)
*   **Step 600,001:** Detect Stagnation.
    *   Logic: Same 1RM for 3 consecutive sessions.
*   **Step 600,002:** Diagonal Shift Strategy.
    *   Action: Swap Main Exercise (Bench Press -> Weighted Dip).
    *   Rationale: Change motor pattern recruitment to bypass neural fatigue.

---

## 🛡️ PART 4: SYSTEM INTEGRITY (THE KERNEL)
*Logic nền tảng đảm bảo hệ thống không bao giờ sai.*

### 4.1 ERROR HANDLING
*   **Step 900,001:** User inputs impossible weight (e.g., 500kg Curl).
    *   Action: Prompt "Are you Hulk? Please confirm weight."
*   **Step 900,002:** Missing Data (Forgot to log a set).
    *   Action: Auto-fill with Previous Session's data (Ghost Set) tagged as "Estimated".

### 4.2 DATA SYNC
*   **Step 900,100:** JSON Blob Construction.
*   **Step 900,101:** Async Push to LocalStorage.
*   **Step 900,102:** Background Push to Postgres Cloud.

---
> **FINAL:** Đây là bản Full-Stack Logic, hợp nhất tất cả các mảnh ghép rời rạc thành một khối thống nhất (Monolith). Không còn tham chiếu chéo, không còn phân mảnh. Một file, một sự thật.
