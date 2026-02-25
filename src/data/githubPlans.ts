export const GITHUB_PLANS = [
    {
        id: 'ppl-reddit',
        name: 'Reddit PPL (6 Buổi/Tuần)',
        tag: 'Phổ biến',
        description: 'Giáo án Push/Pull/Legs kinh điển dành cho người muốn tăng cơ nhanh.',
        plans: [
            {
                id: 'ppl-push-1',
                name: 'PPL: Push A (Ngực/Vai/Tay sau)',
                exercises: [
                    { id: 'p1-1', name: 'Đẩy Ngực Ngang (Barbell)', target: 'Ngực', sets: Array(5).fill({ weight: 60, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p1-2', name: 'Đẩy Vai (Overhead Press)', target: 'Vai', sets: Array(3).fill({ weight: 40, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p1-3', name: 'Đẩy Ngực Trên Tạ Đơn', target: 'Ngực', sets: Array(3).fill({ weight: 20, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p1-4', name: 'Bay Vai (Lateral Raises)', target: 'Vai', sets: Array(3).fill({ weight: 8, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p1-5', name: 'Kéo Cáp Tay Sau', target: 'Tay Sau', sets: Array(3).fill({ weight: 15, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'ppl-pull-1',
                name: 'PPL: Pull A (Lưng/Tay trước)',
                exercises: [
                    { id: 'p2-1', name: 'Chèo Tạ Đòn (Barbell Row)', target: 'Lưng', sets: Array(5).fill({ weight: 60, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p2-2', name: 'Kéo Xà Cáp (Lat Pulldown)', target: 'Lưng', sets: Array(3).fill({ weight: 45, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p2-3', name: 'Chèo Cáp Ngồi', target: 'Lưng', sets: Array(3).fill({ weight: 45, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p2-4', name: 'Kéo Cáp Mặt (Face Pulls)', target: 'Vai', sets: Array(5).fill({ weight: 15, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p2-5', name: 'Cuốn Búa (Hammer Curls)', target: 'Tay Trước', sets: Array(4).fill({ weight: 12, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'ppl-legs-1',
                name: 'PPL: Legs A (Chân/Bụng)',
                exercises: [
                    { id: 'p3-1', name: 'Gánh Tạ (Squat)', target: 'Chân', sets: Array(3).fill({ weight: 80, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p3-2', name: 'Romanian Deadlift', target: 'Chân', sets: Array(3).fill({ weight: 80, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p3-3', name: 'Đạp Đùi (Leg Press)', target: 'Chân', sets: Array(3).fill({ weight: 120, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p3-4', name: 'Cuốn Đùi Sau', target: 'Chân', sets: Array(3).fill({ weight: 30, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'p3-5', name: 'Nhón Bắp Chân', target: 'Chân', sets: Array(5).fill({ weight: 0, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: 'stronglifts-5x5',
        name: 'StrongLifts 5x5',
        tag: 'Sức mạnh',
        description: 'Tập trung vào các bài Compound lớn để xây dựng sức mạnh nền tảng.',
        plans: [
            {
                id: 'sl-a',
                name: 'StrongLifts: Buổi A',
                exercises: [
                    { id: 'sla-1', name: 'Gánh Tạ (Squat)', target: 'Chân', sets: Array(5).fill({ weight: 60, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'sla-2', name: 'Đẩy Ngực Ngang', target: 'Ngực', sets: Array(5).fill({ weight: 40, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'sla-3', name: 'Chèo Tạ Đòn', target: 'Lưng', sets: Array(5).fill({ weight: 40, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'sl-b',
                name: 'StrongLifts: Buổi B',
                exercises: [
                    { id: 'slb-1', name: 'Gánh Tạ (Squat)', target: 'Chân', sets: Array(5).fill({ weight: 62.5, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'slb-2', name: 'Đẩy Vai (OHP)', target: 'Vai', sets: Array(5).fill({ weight: 30, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'slb-3', name: 'Deadlift', target: 'Chân', sets: Array(1).fill({ weight: 80, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: 'upper-lower',
        name: 'Upper/Lower Split (4 Buổi)',
        tag: 'Cân bằng',
        description: 'Phân chia thân trên và tâm dưới, tối ưu hóa tần suất tập luyện.',
        plans: [
            {
                id: 'ul-u',
                name: 'Upper Day (Thân Trên)',
                exercises: [
                    { id: 'uu-1', name: 'Đẩy Ngực Ngang', target: 'Ngực', sets: Array(3).fill({ weight: 60, reps: 8, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'uu-2', name: 'Chèo Tạ Đòn', target: 'Lưng', sets: Array(4).fill({ weight: 50, reps: 8, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'uu-3', name: 'Đẩy Vai Tạ Đơn', target: 'Vai', sets: Array(3).fill({ weight: 18, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'uu-4', name: 'Hít Xà (Pull Ups)', target: 'Lưng', sets: Array(3).fill({ weight: 0, reps: 8, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: 'arnold-split',
        name: 'Arnold Split (6 Buổi/Tuần)',
        tag: 'Bodybuilding (Cổ điển)',
        description: 'Giáo án chia lịch tập kinh điển của Arnold Schwarzenegger. Cường độ cao, tập trung pump cơ.',
        plans: [
            {
                id: 'arnold-1',
                name: 'Arnold A: Ngực & Lưng',
                exercises: [
                    { id: 'aa-1', name: 'Đẩy Ngực Ngang (Barbell)', target: 'Ngực', sets: Array(5).fill({ weight: 60, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'aa-2', name: 'Đẩy Ngực Trên Tạ Đơn', target: 'Ngực', sets: Array(5).fill({ weight: 24, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'aa-3', name: 'Hít Xà (Pull Ups)', target: 'Lưng', sets: Array(5).fill({ weight: 0, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'aa-4', name: 'Chèo Tạ Đòn (Barbell Row)', target: 'Lưng', sets: Array(5).fill({ weight: 50, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'aa-5', name: 'Banh Ngực Tạ Đơn', target: 'Ngực', sets: Array(4).fill({ weight: 12, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'arnold-2',
                name: 'Arnold B: Vai & Tay',
                exercises: [
                    { id: 'ab-1', name: 'Đẩy Vai (Overhead Press)', target: 'Vai', sets: Array(5).fill({ weight: 40, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ab-2', name: 'Bay Vai (Lateral Raises)', target: 'Vai', sets: Array(5).fill({ weight: 8, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ab-3', name: 'Cuốn Tạ Đòn (Barbell Curl)', target: 'Tay Trước', sets: Array(5).fill({ weight: 25, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ab-4', name: 'Skull Crusher', target: 'Tay Sau', sets: Array(5).fill({ weight: 20, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ab-5', name: 'Cuốn Búa (Hammer Curl)', target: 'Tay Trước', sets: Array(4).fill({ weight: 12, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'arnold-3',
                name: 'Arnold C: Chân & Bụng',
                exercises: [
                    { id: 'ac-1', name: 'Gánh Tạ (Squat)', target: 'Chân', sets: Array(5).fill({ weight: 80, reps: 8, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ac-2', name: 'Đạp Đùi (Leg Press)', target: 'Chân', sets: Array(5).fill({ weight: 150, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ac-3', name: 'Romanian Deadlift', target: 'Chân', sets: Array(5).fill({ weight: 80, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ac-4', name: 'Đá Đùi (Leg Extension)', target: 'Chân', sets: Array(5).fill({ weight: 40, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ac-5', name: 'Plank (Giữ Bụng)', target: 'Bụng', sets: Array(4).fill({ weight: 0, reps: 60, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: 'phul',
        name: 'PHUL (4 Buổi/Tuần)',
        tag: 'Sức mạnh & Cơ bắp',
        description: 'Power Hypertrophy Upper Lower. Kết hợp phát triển sức mạnh và kích thước cơ bắp.',
        plans: [
            {
                id: 'phul-1',
                name: 'PHUL: Upper Power (Sức mạnh Thân trên)',
                exercises: [
                    { id: 'pup-1', name: 'Đẩy Ngực Ngang (Barbell)', target: 'Ngực', sets: Array(4).fill({ weight: 70, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'pup-2', name: 'Đẩy Ngực Trên Tạ Đơn', target: 'Ngực', sets: Array(4).fill({ weight: 26, reps: 8, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'pup-3', name: 'Chèo Tạ Đòn (Barbell Row)', target: 'Lưng', sets: Array(4).fill({ weight: 60, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'pup-4', name: 'Đẩy Vai (Overhead Press)', target: 'Vai', sets: Array(3).fill({ weight: 40, reps: 8, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'phul-2',
                name: 'PHUL: Lower Power (Sức mạnh Thân dưới)',
                exercises: [
                    { id: 'plp-1', name: 'Gánh Tạ (Squat)', target: 'Chân', sets: Array(4).fill({ weight: 90, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'plp-2', name: 'Deadlift (Kéo Tạ)', target: 'Lưng', sets: Array(4).fill({ weight: 100, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'plp-3', name: 'Đạp Đùi (Leg Press)', target: 'Chân', sets: Array(5).fill({ weight: 180, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'phul-3',
                name: 'PHUL: Upper Hypertrophy (Cơ bắp Thân trên)',
                exercises: [
                    { id: 'puh-1', name: 'Đẩy Ngực Trên Tạ Đơn', target: 'Ngực', sets: Array(4).fill({ weight: 22, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'puh-2', name: 'Banh Ngực Tạ Đơn', target: 'Ngực', sets: Array(4).fill({ weight: 12, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'puh-3', name: 'Kéo Xà Cáp (Lat Pulldown)', target: 'Lưng', sets: Array(4).fill({ weight: 50, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'puh-4', name: 'Chèo Cáp Ngồi', target: 'Lưng', sets: Array(4).fill({ weight: 50, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'phul-4',
                name: 'PHUL: Lower Hypertrophy (Cơ bắp Thân dưới)',
                exercises: [
                    { id: 'plh-1', name: 'Gánh Tạ (Squat)', target: 'Chân', sets: Array(4).fill({ weight: 70, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'plh-2', name: 'Đá Đùi (Leg Extension)', target: 'Chân', sets: Array(4).fill({ weight: 40, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'plh-3', name: 'Cuốn Đùi Sau', target: 'Chân', sets: Array(4).fill({ weight: 35, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'plh-4', name: 'Nhón Bắp Chân', target: 'Chân', sets: Array(4).fill({ weight: 60, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: '531-bbb',
        name: '5/3/1 Boring But Big (4 Buổi/Tuần)',
        tag: 'Sức mạnh thuần túy',
        description: 'Phương pháp nổi tiếng của Jim Wendler. Tập trung vào bài chính + khối lượng lớn (5 sets x 10 reps).',
        plans: [
            {
                id: 'bbb-1',
                name: '5/3/1: Squat Day',
                exercises: [
                    { id: 'b1-1', name: 'Gánh Tạ (Squat) - 5/3/1', target: 'Chân', sets: Array(3).fill({ weight: 100, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'b1-2', name: 'Gánh Tạ (Squat) - BBB', target: 'Chân', sets: Array(5).fill({ weight: 60, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'b1-3', name: 'Treo Người Đá Bụng', target: 'Bụng', sets: Array(5).fill({ weight: 0, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'bbb-2',
                name: '5/3/1: Bench Day',
                exercises: [
                    { id: 'b2-1', name: 'Đẩy Ngực Ngang (Barbell) - 5/3/1', target: 'Ngực', sets: Array(3).fill({ weight: 80, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'b2-2', name: 'Đẩy Ngực Ngang (Barbell) - BBB', target: 'Ngực', sets: Array(5).fill({ weight: 50, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'b2-3', name: 'Chèo Tạ Đơn (Dumbbell Row)', target: 'Lưng', sets: Array(5).fill({ weight: 30, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'bbb-3',
                name: '5/3/1: Deadlift Day',
                exercises: [
                    { id: 'b3-1', name: 'Deadlift (Kéo Tạ) - 5/3/1', target: 'Lưng', sets: Array(3).fill({ weight: 120, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'b3-2', name: 'Deadlift (Kéo Tạ) - BBB', target: 'Lưng', sets: Array(5).fill({ weight: 80, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'b3-3', name: 'Treo Người Đá Bụng', target: 'Bụng', sets: Array(5).fill({ weight: 0, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'bbb-4',
                name: '5/3/1: Press Day',
                exercises: [
                    { id: 'b4-1', name: 'Đẩy Vai (Overhead Press) - 5/3/1', target: 'Vai', sets: Array(3).fill({ weight: 50, reps: 5, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'b4-2', name: 'Đẩy Vai (Overhead Press) - BBB', target: 'Vai', sets: Array(5).fill({ weight: 30, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'b4-3', name: 'Hít Xà (Pull Ups)', target: 'Lưng', sets: Array(5).fill({ weight: 0, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: 'nsuns-4day',
        name: 'nSuns 5/3/1 LP (4 Buổi/Tuần)',
        tag: 'Sức mạnh & Volume',
        description: 'Chương trình Linear Progression nổi tiếng với khối lượng tập cực lớn. Khuyến nghị cho người đã có nền tảng.',
        plans: [
            {
                id: 'nsuns-1',
                name: 'nSuns: Bench & OHP (Volume)',
                exercises: [
                    { id: 'ns1-1', name: 'Đẩy Ngực Ngang (Barbell)', target: 'Ngực', sets: Array(9).fill({ weight: 60, reps: 4, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns1-2', name: 'Đẩy Vai (Overhead Press)', target: 'Vai', sets: Array(8).fill({ weight: 40, reps: 8, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns1-3', name: 'Chèo Tạ Đòn (Barbell Row)', target: 'Lưng', sets: Array(4).fill({ weight: 50, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns1-4', name: 'Kéo Cáp Tay Sau', target: 'Tay Sau', sets: Array(4).fill({ weight: 20, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'nsuns-2',
                name: 'nSuns: Squat & Sumo Deadlift',
                exercises: [
                    { id: 'ns2-1', name: 'Gánh Tạ (Squat)', target: 'Chân', sets: Array(9).fill({ weight: 90, reps: 4, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns2-2', name: 'Sumo Deadlift', target: 'Chân', sets: Array(8).fill({ weight: 80, reps: 6, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns2-3', name: 'Đá Đùi (Leg Extension)', target: 'Chân', sets: Array(4).fill({ weight: 40, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns2-4', name: 'Plank', target: 'Bụng', sets: Array(4).fill({ weight: 0, reps: 60, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'nsuns-3',
                name: 'nSuns: Bench (Heavy) & CG Bench',
                exercises: [
                    { id: 'ns3-1', name: 'Đẩy Ngực Ngang (Barbell)', target: 'Ngực', sets: Array(9).fill({ weight: 80, reps: 3, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns3-2', name: 'Đẩy Ngực Hẹp Tay (Close Grip)', target: 'Tay Sau', sets: Array(8).fill({ weight: 50, reps: 6, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns3-3', name: 'Hít Xà (Pull Ups)', target: 'Lưng', sets: Array(4).fill({ weight: 0, reps: 8, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns3-4', name: 'Cuốn Tạ Đơn (Dumbbell Curl)', target: 'Tay Trước', sets: Array(4).fill({ weight: 12, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'nsuns-4',
                name: 'nSuns: Deadlift & Front Squat',
                exercises: [
                    { id: 'ns4-1', name: 'Deadlift (Kéo Tạ)', target: 'Lưng', sets: Array(9).fill({ weight: 110, reps: 3, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns4-2', name: 'Front Squat (Gánh Tạ Trước)', target: 'Chân', sets: Array(8).fill({ weight: 60, reps: 6, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns4-3', name: 'Nhón Bắp Chân', target: 'Chân', sets: Array(5).fill({ weight: 0, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'ns4-4', name: 'Gập Bụng', target: 'Bụng', sets: Array(4).fill({ weight: 0, reps: 20, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: 'gzclp',
        name: 'GZCLP (3-4 Buổi/Tuần)',
        tag: 'Linh hoạt',
        description: 'Phương pháp tập luyện phân tầng (Tier 1, 2, 3) rất tốt cho người mới bắt đầu.',
        plans: [
            {
                id: 'gz-1',
                name: 'GZCLP: Buổi A1',
                exercises: [
                    { id: 'g1-1', name: 'Gánh Tạ (Squat) - T1', target: 'Chân', sets: Array(5).fill({ weight: 80, reps: 3, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'g1-2', name: 'Đẩy Ngực Ngang - T2', target: 'Ngực', sets: Array(3).fill({ weight: 50, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'g1-3', name: 'Kéo Xà Cáp - T3', target: 'Lưng', sets: Array(3).fill({ weight: 40, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'gz-2',
                name: 'GZCLP: Buổi B1',
                exercises: [
                    { id: 'g2-1', name: 'Đẩy Vai (OHP) - T1', target: 'Vai', sets: Array(5).fill({ weight: 40, reps: 3, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'g2-2', name: 'Deadlift - T2', target: 'Lưng', sets: Array(3).fill({ weight: 70, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'g2-3', name: 'Chèo Tạ Đơn - T3', target: 'Lưng', sets: Array(3).fill({ weight: 20, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'gz-3',
                name: 'GZCLP: Buổi A2',
                exercises: [
                    { id: 'g3-1', name: 'Đẩy Ngực Ngang - T1', target: 'Ngực', sets: Array(5).fill({ weight: 60, reps: 3, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'g3-2', name: 'Gánh Tạ (Squat) - T2', target: 'Chân', sets: Array(3).fill({ weight: 60, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'g3-3', name: 'Kéo Cáp Mặt - T3', target: 'Vai', sets: Array(3).fill({ weight: 15, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            },
            {
                id: 'gz-4',
                name: 'GZCLP: Buổi B2',
                exercises: [
                    { id: 'g4-1', name: 'Deadlift - T1', target: 'Lưng', sets: Array(5).fill({ weight: 100, reps: 3, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'g4-2', name: 'Đẩy Vai (OHP) - T2', target: 'Vai', sets: Array(3).fill({ weight: 30, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'g4-3', name: 'Kéo Xà Cáp - T3', target: 'Lưng', sets: Array(3).fill({ weight: 40, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: 'bw-beginner',
        name: 'Bodyweight Beginner (Tại Nhà)',
        tag: 'Calisthenics',
        description: 'Giáo án tập luyện tại nhà, không cần dụng cụ (hoặc tối thiểu).',
        plans: [
            {
                id: 'bw-1',
                name: 'Full Body (Tại Nhà)',
                exercises: [
                    { id: 'bw1-1', name: 'Hít Đất (Push Up)', target: 'Ngực', sets: Array(3).fill({ weight: 0, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'bw1-2', name: 'Squat Bodyweight', target: 'Chân', sets: Array(3).fill({ weight: 0, reps: 20, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'bw1-3', name: 'Hít Xà (nếu có)', target: 'Lưng', sets: Array(3).fill({ weight: 0, reps: 8, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'bw1-4', name: 'Lunges (Chùn Chân)', target: 'Chân', sets: Array(3).fill({ weight: 0, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'bw1-5', name: 'Plank', target: 'Bụng', sets: Array(3).fill({ weight: 0, reps: 60, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'bw1-6', name: 'Burpees', target: 'Tim mạch', sets: Array(3).fill({ weight: 0, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: 'cardio-hiit',
        name: 'HIIT & Plyometrics (Đốt Mỡ)',
        tag: 'Cardio',
        description: 'Đốt cháy calo tối đa với cường độ cao ngắt quãng.',
        plans: [
            {
                id: 'hiit-1',
                name: 'HIIT: Đốt Mỡ Toàn Thân',
                exercises: [
                    { id: 'h1-1', name: 'Burpees', target: 'Full Body', sets: Array(4).fill({ weight: 0, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'h1-2', name: 'Leo Núi (Mountain Climbers)', target: 'Core', sets: Array(4).fill({ weight: 0, reps: 40, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'h1-3', name: 'Bật Nhảy (Jump Squat)', target: 'Chân', sets: Array(4).fill({ weight: 0, reps: 20, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'h1-4', name: 'Nhảy Dây', target: 'Cardio', sets: Array(5).fill({ weight: 0, reps: 60, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: 'glute-focus',
        name: 'Glute Master (Tập Mông)',
        tag: 'Nữ / Thẩm mỹ',
        description: 'Chương trình chuyên biệt phát triển cơ mông quyến rũ.',
        plans: [
            {
                id: 'gf-1',
                name: 'Glutes: Heavy Day',
                exercises: [
                    { id: 'gf1-1', name: 'Đẩy Hông (Hip Thrust)', target: 'Mông', sets: Array(4).fill({ weight: 60, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'gf1-2', name: 'Sumo Deadlift', target: 'Mông/Đùi', sets: Array(4).fill({ weight: 60, reps: 8, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'gf1-3', name: 'Lunges (Chùn Chân)', target: 'Chân', sets: Array(3).fill({ weight: 10, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'gf1-4', name: 'Banht Chân (Hip Abduction)', target: 'Mông', sets: Array(4).fill({ weight: 20, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    },
    {
        id: 'arm-special',
        name: 'Arm Blaster (Tay To)',
        tag: 'Bodybuilding',
        description: 'Chuyên biệt để phát triển bắp tay to và cắt nét.',
        plans: [
            {
                id: 'arm-1',
                name: 'Arms: Supersets',
                exercises: [
                    { id: 'a1-1', name: 'Cuốn Tạ Đòn (Barbell Curl)', target: 'Tay Trước', sets: Array(4).fill({ weight: 30, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'a1-2', name: 'Skull Crusher', target: 'Tay Sau', sets: Array(4).fill({ weight: 25, reps: 10, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'a1-3', name: 'Cuốn Búa (Hammer Curl)', target: 'Tay Trước', sets: Array(3).fill({ weight: 14, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'a1-4', name: 'Kéo Cáp Tay Sau', target: 'Tay Sau', sets: Array(3).fill({ weight: 20, reps: 12, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                    { id: 'a1-5', name: 'Cuốn Cổ Tay', target: 'Cẳng Tay', sets: Array(3).fill({ weight: 20, reps: 15, completed: false }).map((s) => ({ ...s, id: crypto.randomUUID() })) },
                ]
            }
        ]
    }
];
