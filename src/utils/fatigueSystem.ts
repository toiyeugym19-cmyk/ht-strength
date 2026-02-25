// ========================================
// FATIGUE MANAGEMENT SYSTEM
// Blueprint: Part 3.2 (Step 500,100-112)
// ========================================

import { useGymStore, type ExerciseLog } from '../store/useGymStore';
import { subDays, isWithinInterval } from 'date-fns';

export interface JointStress {
    joint: string;
    stressLevel: number; // 0-100%
    status: 'OK' | 'ELEVATED' | 'WARNING' | 'CRITICAL';
    recommendation: string;
}

export interface FatigueReport {
    overallFatigue: number;
    jointStress: JointStress[];
    acwr: number; // Acute:Chronic Workload Ratio
    recommendations: string[];
    forceDeload: boolean;
}

// Maps exercises to their primary joint stress
const EXERCISE_JOINT_MAP: Record<string, string[]> = {
    'Bench Press': ['Shoulder', 'Elbow'],
    'Overhead Press': ['Shoulder', 'Elbow'],
    'Incline DB Press': ['Shoulder'],
    'Dip': ['Shoulder', 'Elbow'],
    'Tricep Pushdown': ['Elbow'],
    'Barbell Curl': ['Elbow'],
    'Squat': ['Knee', 'Lower Back'],
    'Deadlift': ['Lower Back', 'Knee'],
    'Romanian Deadlift': ['Lower Back', 'Knee'],
    'Leg Press': ['Knee'],
    'Leg Extension': ['Knee'],
    'Leg Curl': ['Knee'],
    'Barbell Row': ['Lower Back', 'Elbow'],
    'Pull Ups': ['Shoulder', 'Elbow']
};

const EXERCISE_STRESS_WEIGHT: Record<string, number> = {
    'Deadlift': 3,
    'Squat': 2.5,
    'Bench Press': 2,
    'Overhead Press': 2,
    'Romanian Deadlift': 2,
    'Barbell Row': 1.5,
    'default': 1
};

export function calculateFatigueReport(logs: ExerciseLog[]): FatigueReport {
    const today = new Date();
    const last7Days = logs.filter(l =>
        isWithinInterval(new Date(l.date), {
            start: subDays(today, 7),
            end: today
        })
    );

    const last28Days = logs.filter(l =>
        isWithinInterval(new Date(l.date), {
            start: subDays(today, 28),
            end: today
        })
    );

    // Calculate ACWR (Acute:Chronic Workload Ratio)
    const acuteLoad = last7Days.reduce((acc, log) => acc + (log.weight * log.reps), 0);
    const chronicLoad = last28Days.reduce((acc, log) => acc + (log.weight * log.reps), 0) / 4;
    const acwr = chronicLoad > 0 ? Math.round((acuteLoad / chronicLoad) * 100) / 100 : 1;

    // Calculate joint stress
    const jointStress: Record<string, number> = {};

    last7Days.forEach(log => {
        const joints = EXERCISE_JOINT_MAP[log.exerciseName] || [];
        const stressWeight = EXERCISE_STRESS_WEIGHT[log.exerciseName] || 1;

        joints.forEach(joint => {
            jointStress[joint] = (jointStress[joint] || 0) + (log.weight * log.reps * stressWeight * 0.001);
        });
    });

    // Normalize and format joint stress
    const jointStressReport: JointStress[] = Object.entries(jointStress).map(([joint, stress]) => {
        const normalizedStress = Math.min(100, Math.round(stress * 10));
        let status: JointStress['status'] = 'OK';
        let recommendation = '';

        if (normalizedStress >= 90) {
            status = 'CRITICAL';
            recommendation = `Nghỉ ngơi hoàn toàn ${joint}. Tránh mọi bài tập liên quan.`;
        } else if (normalizedStress >= 75) {
            status = 'WARNING';
            recommendation = `Giảm 50% khối lượng cho các bài dính ${joint}.`;
        } else if (normalizedStress >= 50) {
            status = 'ELEVATED';
            recommendation = `Chú ý đến ${joint}. Ưu tiên bài tập isolation nhẹ.`;
        } else {
            recommendation = `${joint} đang ổn. Có thể đẩy mạnh hơn.`;
        }

        return { joint, stressLevel: normalizedStress, status, recommendation };
    });

    // Overall fatigue and recommendations
    const overallFatigue = Math.round(jointStressReport.reduce((acc, j) => acc + j.stressLevel, 0) / Math.max(1, jointStressReport.length));

    const recommendations: string[] = [];
    let forceDeload = false;

    if (acwr > 1.5) {
        recommendations.push('⚠️ ACWR quá cao (>1.5). Nguy cơ chấn thương cao. Nên Deload.');
        forceDeload = true;
    } else if (acwr > 1.3) {
        recommendations.push('💡 ACWR hơi cao. Giảm cường độ 10-20%.');
    } else if (acwr < 0.8) {
        recommendations.push('📉 ACWR thấp. Bạn đang tập ít hơn bình thường. Có thể tăng volume.');
    }

    const criticalJoints = jointStressReport.filter(j => j.status === 'CRITICAL');
    if (criticalJoints.length > 0) {
        recommendations.push(`🚨 Khớp ${criticalJoints.map(j => j.joint).join(', ')} đang quá tải. Nghỉ ngơi bắt buộc.`);
        forceDeload = true;
    }

    if (overallFatigue > 80) {
        recommendations.push('🛑 Độ mệt mỏi tổng thể cao. Hãy nghỉ ngơi 1-2 ngày.');
    }

    if (recommendations.length === 0) {
        recommendations.push('✅ Hệ thống cơ xương khớp đang hoạt động tốt. Tiếp tục chiến đấu!');
    }

    return {
        overallFatigue,
        jointStress: jointStressReport,
        acwr,
        recommendations,
        forceDeload
    };
}

// Hook for easy usage in components
export function useFatigueAnalysis() {
    const { logs } = useGymStore();
    return calculateFatigueReport(logs);
}
