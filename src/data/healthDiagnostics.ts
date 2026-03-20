export interface DiagnosticOption {
    label: string;
    value?: number;
    next?: string;
    result?: string;
}

export interface DiagnosticQuestion {
    id: string;
    question: string;
    options: DiagnosticOption[];
}

export interface DiagnosticTool {
    id: string;
    name: string;
    description: string;
    questions?: DiagnosticQuestion[];
    flow?: DiagnosticQuestion[];
    interpret?: (score: number) => { level: string; color: string; advice: string };
}

export const DIAGNOSTIC_TOOLS: Record<string, DiagnosticTool> = {
    // PHQ-9: Depression Screening
    phq9: {
        id: 'phq9',
        name: 'Sàng lọc trầm cảm (PHQ-9)',
        description: 'Đánh giá mức độ trầm cảm trong 2 tuần qua.',
        questions: [
            { id: 'q1', question: 'Mất hứng thú hoặc niềm vui khi làm mọi việc', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn một nửa số ngày', value: 2 }, { label: 'Gần như hàng ngày', value: 3 }] },
            { id: 'q2', question: 'Cảm thấy chán nản, buồn bã hoặc vô vọng', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn một nửa số ngày', value: 2 }, { label: 'Gần như hàng ngày', value: 3 }] },
            { id: 'q3', question: 'Khó ngủ, ngủ không ngon hoặc ngủ quá nhiều', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn một nửa số ngày', value: 2 }, { label: 'Gần như hàng ngày', value: 3 }] },
            { id: 'q4', question: 'Cảm thấy mệt mỏi hoặc thiếu năng lượng', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn một nửa số ngày', value: 2 }, { label: 'Gần như hàng ngày', value: 3 }] },
            // ... truncated for brevity, standard PHQ-9 has 9 questions. Ideally complete it.
            { id: 'q5', question: 'Chán ăn hoặc ăn quá nhiều', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn một nửa số ngày', value: 2 }, { label: 'Gần như hàng ngày', value: 3 }] },
            { id: 'q6', question: 'Cảm thấy tồi tệ về bản thân - hoặc cảm thấy mình thất bại', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn một nửa số ngày', value: 2 }, { label: 'Gần như hàng ngày', value: 3 }] },
            { id: 'q7', question: 'Khó tập trung vào mọi việc, chẳng hạn như đọc báo hoặc xem tivi', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn một nửa số ngày', value: 2 }, { label: 'Gần như hàng ngày', value: 3 }] },
            { id: 'q8', question: 'Di chuyển hoặc nói chậm hơn bình thường / Hoặc bồn chồn', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn một nửa số ngày', value: 2 }, { label: 'Gần như hàng ngày', value: 3 }] },
            { id: 'q9', question: 'Suy nghĩ rằng chết đi sẽ tốt hơn, hoặc tự làm hại bản thân', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn một nửa số ngày', value: 2 }, { label: 'Gần như hàng ngày', value: 3 }] },
        ],
        interpret: (score: number) => {
            if (score <= 4) return { level: 'Không có dấu hiệu', color: 'text-green-500', advice: 'Tâm trạng ổn định.' };
            if (score <= 9) return { level: 'Trầm cảm nhẹ', color: 'text-yellow-500', advice: 'Theo dõi triệu chứng, thư giãn.' };
            if (score <= 14) return { level: 'Trầm cảm vừa', color: 'text-orange-500', advice: 'Cân nhắc tư vấn chuyên gia.' };
            if (score <= 19) return { level: 'Trầm cảm nặng', color: 'text-red-500', advice: 'Nên gặp bác sĩ hoặc chuyên gia tâm lý.' };
            return { level: 'Trầm cảm rất nặng', color: 'text-red-700', advice: 'Cần sự can thiệp y tế ngay lập tức.' };
        }
    },
    // GAD-7: Anxiety Screening
    gad7: {
        id: 'gad7',
        name: 'Sàng lọc lo âu (GAD-7)',
        description: 'Đánh giá mức độ rối loạn lo âu lan tỏa.',
        questions: [
            { id: 'g1', question: 'Cảm thấy lo lắng, bồn chồn', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn nửa số ngày', value: 2 }, { label: 'Gần như mỗi ngày', value: 3 }] },
            { id: 'g2', question: 'Không thể ngừng hoặc kiểm soát lo lắng', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn nửa số ngày', value: 2 }, { label: 'Gần như mỗi ngày', value: 3 }] },
            { id: 'g3', question: 'Lo lắng quá nhiều về những việc khác nhau', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn nửa số ngày', value: 2 }, { label: 'Gần như mỗi ngày', value: 3 }] },
            { id: 'g4', question: 'Khó thư giãn', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn nửa số ngày', value: 2 }, { label: 'Gần như mỗi ngày', value: 3 }] },
            { id: 'g5', question: 'Bồn chồn đến mức khó ngồi yên', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn nửa số ngày', value: 2 }, { label: 'Gần như mỗi ngày', value: 3 }] },
            { id: 'g6', question: 'Dễ trở nên khó chịu hoặc cáu kỉnh', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn nửa số ngày', value: 2 }, { label: 'Gần như mỗi ngày', value: 3 }] },
            { id: 'g7', question: 'Cảm thấy sợ hãi như thể điều gì khủng khiếp sắp xảy ra', options: [{ label: 'Không', value: 0 }, { label: 'Vài ngày', value: 1 }, { label: 'Hơn nửa số ngày', value: 2 }, { label: 'Gần như mỗi ngày', value: 3 }] },
        ],
        interpret: (score: number) => {
            if (score <= 4) return { level: 'Lo âu tối thiểu', color: 'text-green-500', advice: 'Bình thường.' };
            if (score <= 9) return { level: 'Lo âu nhẹ', color: 'text-yellow-500', advice: 'Theo dõi, tập hít thở.' };
            if (score <= 14) return { level: 'Lo âu vừa', color: 'text-orange-500', advice: 'Đánh giá thêm.' };
            return { level: 'Lo âu nặng', color: 'text-red-500', advice: 'Cần can thiệp chuyên môn.' };
        }
    },
    // Simple Symptom Checker (Rule-based decision tree simulation)
    symptomChecker: {
        id: 'symptom',
        name: 'Kiểm tra triệu chứng (Cơ bản)',
        description: 'Chẩn đoán sơ bộ dựa trên triệu chứng phổ biến.',
        flow: [
            {
                id: 'head',
                question: 'Bạn đang gặp vấn đề ở đâu?',
                options: [
                    { label: 'Đầu (Đau đầu, chóng mặt)', next: 'headache_type' },
                    { label: 'Bụng (Đau bụng, tiêu hóa)', next: 'stomach_type' },
                    { label: 'Hô hấp (Ho, sốt, khó thở)', next: 'respiratory_type' }
                ]
            },
            // Head branch
            {
                id: 'headache_type',
                question: 'Cơn đau như thế nào?',
                options: [
                    { label: 'Đau nửa đầu, nhạy cảm ánh sáng', result: 'Migraine (Đau nửa đầu). Nên nghỉ ngơi nơi tối, yên tĩnh.' },
                    { label: 'Đau căng như thắt vòng quanh đầu', result: 'Đau đầu do căng thẳng (Tension headache). Thư giãn, massage cổ vai gáy.' },
                    { label: 'Đau kèm sốt cao, cứng cổ', result: 'CẢNH BÁO: Có thể là viêm màng não. Đến bệnh viện gấp.' }
                ]
            },
            // Stomach branch
            {
                id: 'stomach_type',
                question: 'Vị trí đau cụ thể?',
                options: [
                    { label: 'Đau vùng thượng vị (trên rốn), ợ chua', result: 'Có thể là trào ngược dạ dày (GERD) hoặc viêm dạ dày.' },
                    { label: 'Đau hố chậu phải, âm ỉ rồi dữ dội', result: 'CẢNH BÁO: Nghi ngờ viêm ruột thừa. Đến bệnh viện ngay.' },
                    { label: 'Đau quặn bụng, đi ngoài lỏng', result: 'Rối loạn tiêu hóa / Ngộ độc thực phẩm nhẹ. Bù nước điện giải.' }
                ]
            },
            // Respiratory branch
            {
                id: 'respiratory_type',
                question: 'Triệu chứng đi kèm là gì?',
                options: [
                    { label: 'Sốt cao, đau nhức cơ, ho khan', result: 'Khả năng cao là Cúm mùa (Flu). Nghỉ ngơi, uống nhiều nước.' },
                    { label: 'Ho đờm, đau ngực khi thở, sốt', result: 'Nghi ngờ viêm phổi hoặc viêm phế quản. Nên đi khám.' },
                    { label: 'Hắt hơi, sổ mũi, ngứa mắt, không sốt', result: 'Dị ứng thời tiết hoặc phấn hoa.' }
                ]
            }
        ]
    }
};
