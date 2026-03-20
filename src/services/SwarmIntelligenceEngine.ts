/**
 * 🐝 SWARM INTELLIGENCE ENGINE
 * Mô phỏng Đa Tác Nhân cho Dự Báo Thành Công Hội Viên
 */

import type { Member } from '../store/useMemberStore';
import type { DailyHealth } from '../store/useHealthStore';

export type SwarmAgentType = 'HEAD_COACH' | 'SPORTS_SCIENTIST' | 'DIETITIAN' | 'BEHAVIORAL';

export interface SwarmMessage {
    agent: SwarmAgentType;
    content: string;
    timestamp: string;
    scoreContribution: number;
}

export interface SwarmForecast {
    memberId: string;
    probabilityOfSuccess: number; // 0-100
    estimatedTimeFrameWeeks: number;
    riskOfChurn: 'THẤP' | 'TRUNG BÌNH' | 'CAO';
    riskOfChurnColor: string;
    consensusScore: number;
    consensusLabel: string;
    agentsDiscussion: SwarmMessage[];
    expertAdvice: {
        training: string;
        nutrition: string;
        lifestyle: string;
    };
}

export class SwarmIntelligenceEngine {
    private member: Member;
    private healthData: DailyHealth | null;

    constructor(member: Member, healthData: DailyHealth | null = null) {
        this.member = member;
        this.healthData = healthData;
    }

    public async runSimulation(): Promise<SwarmForecast> {
        const discussion: SwarmMessage[] = [];
        
        discussion.push(this.simulateBehavioralAgent());
        discussion.push(this.simulateSportsScientist());
        discussion.push(this.simulateDietitian());
        discussion.push(this.simulateHeadCoach(discussion));

        const baseScore = discussion.reduce((acc, m) => acc + m.scoreContribution, 0);
        const probability = Math.min(100, Math.max(0, 50 + baseScore));

        const churnInfo = this.calculateChurnRisk(baseScore);

        return {
            memberId: this.member.id,
            probabilityOfSuccess: Math.round(probability),
            estimatedTimeFrameWeeks: this.calculateEstimatedWeeks(),
            riskOfChurn: churnInfo.label,
            riskOfChurnColor: churnInfo.color,
            consensusScore: baseScore,
            consensusLabel: baseScore > 15 ? 'TÍCH CỰC' : baseScore < -5 ? 'TIÊU CỰC' : 'TRUNG LẬP',
            agentsDiscussion: discussion,
            expertAdvice: {
                training: this.getTrainingAdvice(baseScore),
                nutrition: this.getNutritionAdvice(),
                lifestyle: this.getLifestyleAdvice()
            }
        };
    }

    private simulateBehavioralAgent(): SwarmMessage {
        const checkIns = this.member.checkInHistory.length;
        const lastCheckInDays = this.getDaysSinceLastCheckIn();
        
        let content = "";
        let score = 0;

        if (checkIns > 15 && lastCheckInDays < 3) {
            content = "Hội viên thể hiện sự kiên trì vượt trội. Thói quen tập luyện đã ăn sâu vào nếp sinh hoạt. Dự báo tuân thủ lịch tập đạt 92%.";
            score = 25;
        } else if (checkIns > 5 && lastCheckInDays < 5) {
            content = "Mức độ chuyên cần ở mức trung bình. Duy trì được nền tảng cơ bản nhưng có xu hướng gián đoạn vào cuối tuần.";
            score = 5;
        } else if (lastCheckInDays > 7) {
            content = "CẢNH BÁO: Phát hiện gián đoạn nghiêm trọng trong lịch check-in. Nguy cơ bỏ tập đang leo thang. Nghi ngờ mệt mỏi tâm lý.";
            score = -20;
        } else {
            content = "Hội viên mới bắt đầu, chưa đủ dữ liệu để đánh giá xu hướng hành vi. Cần theo dõi thêm 2 tuần.";
            score = 0;
        }

        return { agent: 'BEHAVIORAL', content, timestamp: new Date().toISOString(), scoreContribution: score };
    }

    private simulateSportsScientist(): SwarmMessage {
        const hasPlan = !!this.member.assignedWorkoutPlanId;
        const bodyMetricsCount = this.member.bodyMetrics?.length || 0;
        const workoutCount = this.member.workoutHistory?.length || 0;
        
        let content = "";
        let score = 0;

        if (hasPlan && bodyMetricsCount > 1 && workoutCount > 3) {
            content = "Các chỉ số sinh lý cho thấy cơ thể đang thích nghi tích cực. Đề xuất tăng tải trọng dần để kích thích phát triển cơ bắp ở giai đoạn tiếp theo.";
            score = 20;
        } else if (hasPlan && workoutCount > 0) {
            content = "Đang ở giai đoạn thích nghi thần kinh. Form tập ổn, nhưng cường độ cần tăng 10% ở buổi tập kế tiếp để phá vỡ ngưỡng hiện tại.";
            score = 8;
        } else if (!hasPlan) {
            content = "CẢNH BÁO: Không phát hiện giáo án tập luyện có cấu trúc. Kích thích cơ học không tối ưu, dẫn đến kết quả phát triển cơ dưới mức kỳ vọng.";
            score = -10;
        } else {
            content = "Có giáo án nhưng chưa ghi nhận được buổi tập nào. Cần kiểm tra lại tình trạng tuân thủ kế hoạch tập luyện.";
            score = -5;
        }

        return { agent: 'SPORTS_SCIENTIST', content, timestamp: new Date().toISOString(), scoreContribution: score };
    }

    private simulateDietitian(): SwarmMessage {
        const hasMealPlan = !!this.member.assignedMealPlan;
        const hasHealthSync = this.healthData && this.healthData.weight > 0;
        const hasGoals = !!this.member.goalTargets;
        
        let content = "";
        let score = 0;

        if (hasMealPlan && hasHealthSync) {
            content = "Phân bổ dinh dưỡng đã được tối ưu hóa. Dữ liệu sinh trắc học xác nhận mức tuân thủ chuyển hóa tốt. Protein đạt mục tiêu 2.0g/kg.";
            score = 20;
        } else if (hasMealPlan) {
            content = "Đã có chế độ ăn được phân bổ, nhưng thiếu vòng phản hồi sinh trắc học. Giả định mức tuân thủ khoảng 70%.";
            score = 10;
        } else if (hasGoals) {
            content = "Có mục tiêu vóc dáng nhưng chưa được gắn chế độ dinh dưỡng cụ thể. Đề xuất lập kế hoạch bữa ăn ngay lập tức.";
            score = -5;
        } else {
            content = "CẢNH BÁO: Lượng dinh dưỡng không được giám sát. Nguy cơ cao đình trệ phục hồi ở giai đoạn tập luyện thứ 2. Hội viên có thể bị chững tiến.";
            score = -10;
        }

        return { agent: 'DIETITIAN', content, timestamp: new Date().toISOString(), scoreContribution: score };
    }

    private simulateHeadCoach(prevMsgs: SwarmMessage[]): SwarmMessage {
        const totalScore = prevMsgs.reduce((a, b) => a + b.scoreContribution, 0);
        
        let content = "";
        if (totalScore > 15) {
            content = "KẾT LUẬN HỘI ĐỒNG: TÍCH CỰC ✅ Xác suất tiến bộ cao. Hội viên đã bước vào \"Giai đoạn Đà Tăng Trưởng\". Đề xuất duy trì lộ trình và tăng cường thử thách.";
        } else if (totalScore < -5) {
            content = "KẾT LUẬN HỘI ĐỒNG: TIÊU CỰC ⚠️ Cần can thiệp ngay lập tức để ngăn chặn hội viên bỏ tập trong vòng 14 ngày tới. Đề xuất liên hệ tư vấn trực tiếp.";
        } else {
            content = "KẾT LUẬN HỘI ĐỒNG: TRUNG LẬP ⏸️ Đang ở trạng thái ổn định. Cần thêm dữ liệu sinh trắc học và ít nhất 2 tuần theo dõi để đưa ra dự báo chính xác hơn.";
        }

        return { agent: 'HEAD_COACH', content, timestamp: new Date().toISOString(), scoreContribution: 5 };
    }

    private getTrainingAdvice(score: number): string {
        if (score > 15) return "Tăng cường độ tập lên 10-15%. Đã sẵn sàng cho giai đoạn overload tiến bộ. Bổ sung thêm bài tập compound.";
        if (score > 0) return "Giữ nguyên khối lượng tập hiện tại. Tập trung cải thiện kỹ thuật và ROM trước khi tăng tải.";
        return "Cần thiết lập giáo án tập luyện có cấu trúc ngay. Ưu tiên các bài tập cơ bản với tải trọng vừa phải.";
    }

    private getNutritionAdvice(): string {
        if (this.member.assignedMealPlan) return "Tiếp tục theo chế độ ăn hiện tại. Đảm bảo bổ sung đủ protein sau buổi tập (30-40g trong 2 giờ).";
        return "Lập kế hoạch dinh dưỡng ngay. Ưu tiên protein 1.6-2.0g/kg và chia thành 4-5 bữa/ngày.";
    }

    private getLifestyleAdvice(): string {
        const days = this.getDaysSinceLastCheckIn();
        if (days > 7) return "Đặt lịch nhắc nhở tập luyện. Tìm bạn tập cùng để tăng động lực. Mục tiêu: ít nhất 3 buổi/tuần.";
        if (days > 3) return "Duy trì nhịp độ hiện tại. Ngủ đủ 7-8 tiếng và giảm stress để tối ưu phục hồi.";
        return "Thói quen tập luyện rất tốt! Bổ sung thêm thiền 10 phút/ngày và giữ vững nhịp sinh hoạt.";
    }

    private getDaysSinceLastCheckIn(): number {
        if (!this.member.lastCheckIn) return 99;
        const last = new Date(this.member.lastCheckIn).getTime();
        const now = new Date().getTime();
        return Math.floor((now - last) / (1000 * 60 * 60 * 24));
    }

    private calculateEstimatedWeeks(): number {
        const type = this.member.membershipType.toLowerCase();
        if (type.includes('year') || type.includes('1 năm')) return 12;
        if (type.includes('6') || type.includes('6 tháng')) return 8;
        if (type.includes('3') || type.includes('3 tháng')) return 6;
        return 4;
    }

    private calculateChurnRisk(score: number): { label: 'THẤP' | 'TRUNG BÌNH' | 'CAO'; color: string } {
        if (score > 20) return { label: 'THẤP', color: '#30D158' };
        if (score > 5) return { label: 'TRUNG BÌNH', color: '#FF9F0A' };
        return { label: 'CAO', color: '#FF453A' };
    }
}
