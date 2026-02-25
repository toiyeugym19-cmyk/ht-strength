import type { DailyHealth } from '../store/useHealthStore';
import type { ExerciseLog } from '../store/useGymStore';

export interface PerformanceInsights {
    readinessScore: number; // 0-100
    status: 'OPTIMAL' | 'RECOVERY' | 'FATIGUED' | 'UNKNOWN';
    advice: string;
    recommendation: string;
    alerts?: string[];
}

export function analyzePerformance(healthData: DailyHealth | undefined, logs: ExerciseLog[] = []): PerformanceInsights {
    const alerts: string[] = [];

    // --- HEALTH DATA ANALYSIS ---
    if (!healthData || (healthData.steps === 0 && healthData.heartRateAvg === 0)) {
        return {
            readinessScore: 0,
            status: 'UNKNOWN',
            advice: "Đang chờ dữ liệu đồng bộ từ điện thoại...",
            recommendation: "Hãy nhấn nút 'Đồng bộ dữ liệu thật' để bắt đầu phân tích.",
            alerts: ["Chưa có dữ liệu sinh trắc học hôm nay."]
        };
    }

    let score = 50; // Base score

    // Steps impact (Goal is 8000)
    const stepRatio = Math.min(healthData.steps / 8000, 1.25);
    score += (stepRatio * 20);

    // Sleep impact (Goal is 8h)
    const sleepRatio = Math.min(healthData.sleepHours / 8, 1.25);
    score += (sleepRatio * 20);

    // Heart Rate impact
    if (healthData.heartRateAvg > 85) {
        score -= 15;
        alerts.push("Nhịp tim trung bình hơi cao - Dấu hiệu CNS mệt mỏi.");
    } else if (healthData.heartRateAvg < 70) {
        score += 10;
    }

    // --- GYM PROGRESSION ANALYSIS (PLATEAU DETECTION) ---
    // Look at last 3 sessions for each exercise
    const exercisePlateaus = detectPlateaus(logs);
    if (exercisePlateaus.length > 0) {
        alerts.push(`Phát hiện chững tạ (Plateau) tại: ${exercisePlateaus.join(', ')}`);
    }

    // Normalize
    score = Math.max(0, Math.min(100, Math.round(score)));

    let status: PerformanceInsights['status'] = 'RECOVERY';
    let advice = "";
    let recommendation = "";

    if (score > 80) {
        status = 'OPTIMAL';
        advice = "Cơ thể bạn đang ở trạng thái đỉnh cao!";
        recommendation = exercisePlateaus.length > 0
            ? "Cơ thể sung mãn nhưng đang chững tạ. Hãy thử 'Diagonal Shift Strategy' (Đổi biến thể bài tập) hôm nay."
            : "Hôm nay là ngày tuyệt vời để tập các bài compound nặng hoặc Cardio cường độ cao.";
    } else if (score > 60) {
        status = 'RECOVERY';
        advice = "Trạng thái ổn định, sẵn sàng luyện tập.";
        recommendation = "Duy trì khối lượng tập trung bình. Đừng quên nạp đủ protein.";
    } else {
        status = 'FATIGUED';
        advice = "Dấu hiệu mệt mỏi hệ thần kinh.";
        recommendation = "Nên tập nhẹ (Deload) hoặc nghỉ ngơi hoàn toàn. Ưu tiên giấc ngủ và giãn cơ.";
    }

    return { readinessScore: score, status, advice, recommendation, alerts };
}

function detectPlateaus(logs: ExerciseLog[]): string[] {
    const plateaus: string[] = [];
    const exerciseNames = Array.from(new Set(logs.map(l => l.exerciseName)));

    for (const name of exerciseNames) {
        const sortedLogs = logs
            .filter(l => l.exerciseName === name)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3); // Last 3 sessions

        if (sortedLogs.length >= 3) {
            const e1RMs = sortedLogs.map(l => l.e1RM);
            // Check if e1RM hasn't increased (within 1% margin) for 3 sessions
            const isStagnant = e1RMs.every(val => val <= e1RMs[0] * 1.01);
            if (isStagnant) {
                plateaus.push(name);
            }
        }
    }

    return plateaus;
}
