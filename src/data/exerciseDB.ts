export interface Exercise {
    id: string;
    name: string;
    target: string;
    equipment: string;
    gifUrl?: string;
    instructions: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    primaryMuscle?: string;
    secondaryMuscles?: string[];
}

export const EXERCISE_DB: Exercise[] = [
    // Chest
    {
        id: 'chest-001',
        name: 'Đẩy Ngực Ngang (Barbell)',
        target: 'Gym/Ngực',
        equipment: 'Thanh đòn',
        difficulty: 'intermediate',
        gifUrl: '/bench_press_technique_new_1768227996228.png',
        primaryMuscle: 'Cơ Ngực Lớn',
        secondaryMuscles: ['Tay Sau', 'Vai Trước'],
        instructions: [
            'Nằm thẳng trên ghế, mắt dưới thanh đòn.',
            'Nắm thanh đòn rộng hơn vai một chút.',
            'Hạ tạ xuống giữa ngực trong khi hít vào.',
            'Đẩy tạ lên mạnh mẽ trong khi thở ra.'
        ]
    },
    {
        id: 'chest-004',
        name: 'Banh Ngực Tạ Đơn',
        target: 'Gym/Ngực',
        equipment: 'Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Cơ Ngực Lớn',
        secondaryMuscles: ['Vai Trước'],
        instructions: [
            'Nằm trên ghế, cầm tạ đơn phía trên ngực, khuỷu tay hơi cong.',
            'Hạ tạ sang hai bên theo hình vòng cung rộng cho đến khi ngực căng.',
            'Đưa tạ trở lại vị trí bắt đầu, như đang ôm một cái cây lớn.'
        ]
    },

    // Back
    {
        id: 'back-001',
        name: 'Hít Xà Đơn',
        target: 'Gym/Lưng',
        equipment: 'Bodyweight',
        difficulty: 'advanced',
        primaryMuscle: 'Xô (Lats)',
        secondaryMuscles: ['Tay Trước (Biceps)', 'Lưng Giữa'],
        instructions: [
            'Treo người trên xà với tay rộng hơn vai.',
            'Kéo ngực lên phía xà bằng cách ép khuỷu tay xuống.',
            'Hạ xuống có kiểm soát cho đến khi tay duỗi thẳng.'
        ]
    },
    {
        id: 'back-003',
        name: 'Kéo Xà Cáp (Lat Pulldown)',
        target: 'Gym/Lưng',
        equipment: 'Máy cáp',
        difficulty: 'beginner',
        primaryMuscle: 'Xô (Lats)',
        secondaryMuscles: ['Tay Trước (Biceps)', 'Lưng Trên'],
        instructions: [
            'Ngồi vào máy, nắm thanh đòn rộng tay.',
            'Kéo thanh đòn xuống phía ngực trên, hơi ngả người ra sau.',
            'Siết cơ xô ở điểm thấp nhất và thả từ từ.'
        ]
    },
    {
        id: 'back-004',
        name: 'Deadlift (Kéo Tạ)',
        target: 'Gym/Lưng',
        equipment: 'Thanh đòn',
        difficulty: 'advanced',
        gifUrl: '/deadlift_technique_1768227973188.png',
        primaryMuscle: 'Lưng Dưới',
        secondaryMuscles: ['Đùi Sau', 'Mông', 'Cầu Vai'],
        instructions: [
            'Đứng với giữa bàn chân dưới thanh đòn.',
            'Gập hông và gối, nắm lấy thanh đòn.',
            'Nâng tạ bằng cách duỗi hông và gối, giữ thanh đòn sát cơ thể.',
            'Đứng thẳng, sau đó hạ tạ xuống sàn.'
        ]
    },

    // Legs
    {
        id: 'leg-001',
        name: 'Gánh Tạ (Squat)',
        target: 'Gym/Chân',
        equipment: 'Thanh đòn',
        difficulty: 'advanced',
        gifUrl: '/squat_technique_1768227949619.png',
        primaryMuscle: 'Đùi Trước',
        secondaryMuscles: ['Mông', 'Đùi Sau', 'Core'],
        instructions: [
            'Thanh đòn nằm trên cầu vai, chân rộng bằng vai.',
            'Ngồi xuống và ra sau cho đến khi đùi song song với sàn.',
            'Đạp mạnh gót chân để đứng dậy.'
        ]
    },
    {
        id: 'leg-003',
        name: 'Đá Đùi (Leg Extension)',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Đùi Trước',
        instructions: [
            'Ngồi vào máy, cổ chân đặt dưới đệm.',
            'Duỗi thẳng chân, siết cơ đùi ở điểm cao nhất.',
            'Hạ xuống từ từ về vị trí bắt đầu.'
        ]
    },

    // Shoulders
    {
        id: 'sh-001',
        name: 'Đẩy Vai (Overhead Press)',
        target: 'Gym/Vai',
        equipment: 'Thanh đòn',
        difficulty: 'intermediate',
        primaryMuscle: 'Cơ Vai',
        secondaryMuscles: ['Tay Sau', 'Ngực Trên'],
        instructions: [
            'Thanh đòn ngang xương đòn, nắm rộng bằng vai.',
            'Đẩy tạ qua đầu cho đến khi tay duỗi thẳng.',
            'Hạ tạ xuống ngực có kiểm soát.'
        ]
    },
    {
        id: 'sh-003',
        name: 'Kéo Cáp Mặt (Face Pull)',
        target: 'Gym/Vai',
        equipment: 'Máy cáp',
        difficulty: 'beginner',
        primaryMuscle: 'Vai Sau',
        secondaryMuscles: ['Cầu Vai', 'Rotator Cuff'],
        instructions: [
            'Sử dụng dây thừng ở vị trí ngang mắt.',
            'Kéo dây về phía mặt, tách hai đầu dây ra.',
            'Siết chặt hai bả vai lại với nhau.'
        ]
    },

    // Arms
    {
        id: 'arm-001',
        name: 'Cuốn Tạ Đòn (Barbell Curl)',
        target: 'Gym/Tay',
        equipment: 'Thanh đòn',
        difficulty: 'beginner',
        primaryMuscle: 'Tay Trước (Biceps)',
        instructions: [
            'Đứng thẳng, nắm thanh đòn lòng bàn tay hướng lên.',
            'Cuốn tạ lên phía vai, giữ khuỷu tay cố định sát hông.',
            'Hạ tạ xuống chậm rãi.'
        ]
    },
    {
        id: 'arm-002',
        name: 'Thừng Kéo Tay Sau',
        target: 'Gym/Tay',
        equipment: 'Máy cáp',
        difficulty: 'beginner',
        primaryMuscle: 'Tay Sau (Triceps)',
        instructions: [
            'Đứng đối diện máy cable, nắm dây thừng.',
            'Đẩy dây xuống dưới cho đến khi tay duỗi thẳng.',
            'Gồng cơ tam đầu ở đáy và từ từ đưa lên.'
        ]
    },
    {
        id: 'arm-003',
        name: 'Cuốn Búa (Hammer Curl)',
        target: 'Gym/Tay',
        equipment: 'Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Cơ Cánh Tay',
        instructions: [
            'Nắm tạ đơn lòng bàn tay hướng vào thân người.',
            'Cuốn tạ lên như đang đóng đinh.',
            'Hạ xuống có kiểm soát.'
        ]
    },

    {
        id: 'chest-005',
        name: 'Đẩy Ngực Trên',
        target: 'Gym/Ngực',
        equipment: 'Thanh đòn',
        difficulty: 'intermediate',
        primaryMuscle: 'Ngực Trên',
        secondaryMuscles: ['Tay Sau', 'Vai Trước'],
        instructions: [
            'Ghế dốc 30-45 độ.',
            'Hạ thanh đòn xuống ngực trên.',
            'Đẩy lên, tập trung vào việc co cơ ngực trên.'
        ]
    },
    {
        id: 'back-005',
        name: 'Chèo Tạ Đơn (Dumbbell Row)',
        target: 'Gym/Lưng',
        equipment: 'Tạ đơn',
        difficulty: 'intermediate',
        primaryMuscle: 'Xô (Lats)',
        secondaryMuscles: ['Lưng Giữa', 'Tay Trước'],
        instructions: [
            'Một tay và đầu gối đặt trên ghế.',
            'Kéo tạ về phía hông, giữ khuỷu tay sát người.',
            'Siết bả vai ở điểm cao nhất.'
        ]
    },
    {
        id: 'leg-004',
        name: 'Đạp Đùi (Leg Press)',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Đùi Trước',
        secondaryMuscles: ['Mông', 'Đùi Sau'],
        instructions: [
            'Chân đặt rộng bằng vai trên bàn đạp.',
            'Hạ xuống cho đến khi gối gập 90 độ.',
            'Đẩy lên nhưng không khóa khớp gối.'
        ]
    },
    {
        id: 'leg-005',
        name: 'Romanian Deadlift (RDL)',
        target: 'Gym/Chân',
        equipment: 'Thanh đòn',
        difficulty: 'intermediate',
        primaryMuscle: 'Đùi Sau',
        secondaryMuscles: ['Mông', 'Lưng Dưới'],
        instructions: [
            'Đứng thẳng với thanh đòn.',
            'Gập hông, hạ thanh đòn dọc theo chân.',
            'Cảm nhận độ căng ở đùi sau và trở lại vị trí đứng.'
        ]
    },

    // Core
    {
        id: 'core-001',
        name: 'Plank (Giữ Bụng)',
        target: 'Gym/Bụng',
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        primaryMuscle: 'Cơ Bụng',
        instructions: [
            'Cẳng tay và mũi chân chạm sàn, người thẳng.',
            'Siết chặt cơ bụng, giữ nguyên tư thế.',
            'Giữ càng lâu càng tốt.'
        ]
    },
    {
        id: 'core-002',
        name: 'Treo Người Đá Bụng',
        target: 'Gym/Bụng',
        equipment: 'Xà đơn',
        difficulty: 'intermediate',
        primaryMuscle: 'Bụng Dưới',
        instructions: [
            'Treo người trên xà, chân duỗi thẳng.',
            'Nâng chân lên cho đến khi song song với sàn.',
            'Hạ xuống chậm rãi, tránh đung đưa.'
        ]
    },
    // --- CHEST EXPANSION ---
    {
        id: 'chest-006',
        name: 'Đẩy Ngực Dốc Lên (Incline Dumbbell Press)',
        target: 'Gym/Ngực',
        equipment: 'Tạ đơn',
        difficulty: 'intermediate',
        primaryMuscle: 'Ngực Trên',
        secondaryMuscles: ['Vai Trước', 'Tay Sau'],
        instructions: [
            'Nằm trên ghế dốc 30-45 độ, cầm tạ đơn.',
            'Đẩy tạ thẳng lên trên ngực, hai lòng bàn tay hướng vào nhau hoặc về phía trước.',
            'Hạ tạ xuống chậm rãi cho đến khi ngang ngực.'
        ]
    },
    {
        id: 'chest-007',
        name: 'Ép Ngực Máy (Pec Deck Fly)',
        target: 'Gym/Ngực',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Ngực Trong',
        secondaryMuscles: ['Vai Trước'],
        instructions: [
            'Ngồi vào máy, lưng thẳng.',
            'Đặt tay lên tay cầm hoặc đệm tay, ép hai tay lại gần nhau.',
            'Giữ 1 giây ở điểm ép sát nhất, sau đó mở rộng tay về vị trí đầu.'
        ]
    },
    {
        id: 'chest-008',
        name: 'Xà Kép (Dips)',
        target: 'Gym/Ngực',
        equipment: 'Xà kép',
        difficulty: 'advanced',
        primaryMuscle: 'Ngực Dưới',
        secondaryMuscles: ['Tay Sau', 'Vai Trước'],
        instructions: [
            'Nắm hai thanh xà, nâng người lên.',
            'Hơi đổ người về phía trước để tập trung vào ngực.',
            'Hạ người xuống cho đến khi khuỷu tay gập 90 độ.',
            'Đẩy ngược lên vị trí ban đầu.'
        ]
    },
    {
        id: 'chest-009',
        name: 'Hít Đất (Push Up)',
        target: 'Gym/Ngực',
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        primaryMuscle: 'Cơ Ngực Lớn',
        secondaryMuscles: ['Tay Sau', 'Vai Trước', 'Core'],
        instructions: [
            'Chống tay xuống sàn, rộng hơn vai.',
            'Giữ thân người thẳng từ đầu đến gót chân.',
            'Hạ người xuống cho đến khi ngực gần chạm sàn.',
            'Đẩy người lên trở lại.'
        ]
    },

    // --- BACK EXPANSION ---
    {
        id: 'back-006',
        name: 'Chèo Cáp Ngồi (Seated Cable Row)',
        target: 'Gym/Lưng',
        equipment: 'Máy cáp',
        difficulty: 'intermediate',
        primaryMuscle: 'Lưng Giữa',
        secondaryMuscles: ['Xô', 'Tay Trước', 'Vai Sau'],
        instructions: [
            'Ngồi thẳng lưng, chân đặt lên đệm đỡ.',
            'Kéo tay cầm về phía bụng dưới, ép bả vai lại.',
            'Không đung đưa người quá nhiều, thả tạ có kiểm soát.'
        ]
    },
    {
        id: 'back-007',
        name: 'Chèo Tạ Đòn Chữ T (T-Bar Row)',
        target: 'Gym/Lưng',
        equipment: 'Máy tập/Thanh đòn',
        difficulty: 'intermediate',
        primaryMuscle: 'Lưng Giữa',
        secondaryMuscles: ['Xô', 'Tay Trước'],
        instructions: [
            'Đứng trên bục máy T-Bar hoặc setup thanh đòn.',
            'Giữ lưng thẳng, gập hông 45 độ.',
            'Kéo tạ về phía ngực, ép chặt cơ lưng.',
            'Hạ tạ xuống cho đến khi tay duỗi thẳng.'
        ]
    },
    {
        id: 'back-008',
        name: 'Lưng Dưới (Hyperextension)',
        target: 'Gym/Lưng',
        equipment: 'Ghế tập',
        difficulty: 'beginner',
        primaryMuscle: 'Lưng Dưới',
        secondaryMuscles: ['Mông', 'Đùi Sau'],
        instructions: [
            'Nằm sấp trên ghế tập lưng dưới.',
            'Gập người xuống tại khớp hông.',
            'Nâng người lên cho đến khi thân người thẳng hàng.',
            'Tránh ưỡn lưng quá mức.'
        ]
    },

    // --- LEGS EXPANSION ---
    {
        id: 'leg-006',
        name: 'Chùn Chân (Lunges)',
        target: 'Gym/Chân',
        equipment: 'Tạ đơn/Bodyweight',
        difficulty: 'intermediate',
        primaryMuscle: 'Đùi Trước',
        secondaryMuscles: ['Mông', 'Đùi Sau'],
        instructions: [
            'Đứng thẳng, bước một chân về phía trước.',
            'Hạ trọng tâm cho đến khi hai gối gập 90 độ.',
            'Đạp mạnh chân trước để trở về tư thế đứng.',
            'Đổi chân và lặp lại.'
        ]
    },
    {
        id: 'leg-007',
        name: 'Nhón Bắp Chân Đứng (Standing Calf Raise)',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Bắp Chân',
        instructions: [
            'Đứng trên máy hoặc bục, mũi chân đặt lên mép.',
            'Hạ gót chân xuống thấp nhất có thể.',
            'Nhón gót lên cao hết mức, siết cơ bắp chân.'
        ]
    },
    {
        id: 'leg-008',
        name: 'Cuốn Đùi Sau Nằm (Lying Leg Curl)',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Đùi Sau',
        instructions: [
            'Nằm sấp trên máy, cổ chân đặt dưới đệm.',
            'Gập chân cuốn đệm lên phía mông.',
            'Giữ 1 giây rồi hạ xuống chậm rãi.'
        ]
    },
    {
        id: 'leg-009',
        name: 'Đẩy Hông (Hip Thrust)',
        target: 'Gym/Chân',
        equipment: 'Thanh đòn',
        difficulty: 'intermediate',
        primaryMuscle: 'Mông (Glutes)',
        secondaryMuscles: ['Đùi Sau'],
        instructions: [
            'Tựa lưng trên ghế, thanh đòn đặt ngang hông.',
            'Dùng lực mông đẩy hông lên cao cho đến khi người thẳng.',
            'Siết chặt mông ở điểm cao nhất, hạ xuống có kiểm soát.'
        ]
    },
    {
        id: 'leg-010',
        name: 'Hack Squat',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'intermediate',
        primaryMuscle: 'Đùi Trước',
        secondaryMuscles: ['Mông'],
        instructions: [
            'Tựa lưng vào đệm máy Hack Squat, vai đặt dưới đệm đỡ.',
            'Mở khóa an toàn, hạ người xuống sâu.',
            'Đạp mạnh để đứng dậy, không khóa khớp gối.'
        ]
    },

    // --- SHOULDERS EXPANSION ---
    {
        id: 'sh-004',
        name: 'Bay Vai (Lateral Raise)',
        target: 'Gym/Vai',
        equipment: 'Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Vai Giữa',
        instructions: [
            'Đứng thẳng, cầm tạ đơn hai bên hông.',
            'Nâng tạ sang hai bên cho đến khi ngang vai.',
            'Khuỷu tay hơi cong, không dùng đà để vung tạ.',
            'Hạ xuống chậm rãi.'
        ]
    },
    {
        id: 'sh-005',
        name: 'Nâng Vai Trước (Front Raise)',
        target: 'Gym/Vai',
        equipment: 'Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Vai Trước',
        instructions: [
            'Cầm tạ đơn trước đùi.',
            'Nâng tạ về phía trước mặt cho đến khi ngang tầm mắt.',
            'Hạ xuống có kiểm soát.'
        ]
    },
    {
        id: 'sh-006',
        name: 'Kéo Thẳng Đứng (Upright Row)',
        target: 'Gym/Vai',
        equipment: 'Thanh đòn/EZ Bar',
        difficulty: 'intermediate',
        primaryMuscle: 'Vai Cầu (Traps)',
        secondaryMuscles: ['Vai Giữa'],
        instructions: [
            'Nắm thanh đòn hẹp tay, sát đùi.',
            'Kéo thanh đòn dọc theo thân người lên ngang ngực.',
            'Khuỷu tay luôn cao hơn cổ tay.',
            'Hạ xuống vị trí ban đầu.'
        ]
    },
    {
        id: 'sh-007',
        name: 'Bay Vai Ngược (Reverse Fly)',
        target: 'Gym/Vai',
        equipment: 'Máy tập/Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Vai Sau',
        instructions: [
            'Ngồi ngược trên ghế tập ngực hoặc cúi thấp người.',
            'Mở rộng tay ra sau, ép hai bả vai lại.',
            'Tập trung vào cơ vai sau, không nhún vai.'
        ]
    },

    // --- ARMS EXPANSION ---
    {
        id: 'arm-004',
        name: 'Duỗi Tay Sau Qua Đầu (Overhead Extension)',
        target: 'Gym/Tay',
        equipment: 'Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Tay Sau (Long Head)',
        instructions: [
            'Ngồi hoặc đứng, cầm tạ đơn bằng hai tay đưa qua đầu.',
            'Hạ tạ xuống sau đầu sâu hết mức có thể.',
            'Duỗi thẳng tay đưa tạ lên cao.'
        ]
    },
    {
        id: 'arm-005',
        name: 'Cuốn Tay Trước Ghế Dốc (Incline Curl)',
        target: 'Gym/Tay',
        equipment: 'Tạ đơn',
        difficulty: 'intermediate',
        primaryMuscle: 'Tay Trước (Long Head)',
        instructions: [
            'Ngồi trên ghế dốc 45 độ.',
            'Thả tay thẳng xuống sàn, giữ tạ đơn.',
            'Cuốn tạ lên mà không di chuyển khuỷu tay.',
            'Cảm nhận độ căng của bắp tay khi hạ xuống.'
        ]
    },
    {
        id: 'arm-006',
        name: 'Duỗi Tay Sau Ghế (Bench Dip)',
        target: 'Gym/Tay',
        equipment: 'Ghế tập',
        difficulty: 'beginner',
        primaryMuscle: 'Tay Sau',
        instructions: [
            'Đặt tay lên mép ghế, chân duỗi thẳng hoặc gập gối.',
            'Hạ hông xuống sàn cho đến khi khuỷu tay gập 90 độ.',
            'Đẩy mạnh tay để nâng người lên.'
        ]
    },
    {
        id: 'arm-007',
        name: 'Skull Crusher',
        target: 'Gym/Tay',
        equipment: 'Thanh EZ',
        difficulty: 'intermediate',
        primaryMuscle: 'Tay Sau',
        instructions: [
            'Nằm trên ghế, cầm thanh EZ đưa thẳng lên trần.',
            'Gập khuỷu tay, hạ thanh đòn xuống trán.',
            'Giữ khuỷu tay cố định, đẩy thanh đòn trở lại vị trí cũ.'
        ]
    },
    {
        id: 'arm-008',
        name: 'Cuốn Tạ Tập trung (Concentration Curl)',
        target: 'Gym/Tay',
        equipment: 'Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Tay Trước (Peak)',
        instructions: [
            'Ngồi trên ghế, khuỷu tay tựa vào đùi trong.',
            'Cuốn tạ lên tập trung vào đỉnh bắp tay.',
            'Hạ xuống chậm rãi hết biên độ.'
        ]
    },

    // --- CORE EXPANSION ---
    {
        id: 'core-003',
        name: 'Gập Bụng (Crunches)',
        target: 'Gym/Bụng',
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        primaryMuscle: 'Bụng Trên',
        instructions: [
            'Nằm ngửa, gập gối, tay đặt sau đầu.',
            'Nâng vai lên khỏi sàn, cuộn cơ bụng lại.',
            'Hạ xuống nhưng không thả lỏng hoàn toàn.'
        ]
    },
    {
        id: 'core-004',
        name: 'Xoay Người Nga (Russian Twist)',
        target: 'Gym/Bụng',
        equipment: 'Bóng/Tạ đơn',
        difficulty: 'intermediate',
        primaryMuscle: 'Cơ Liên Sườn',
        instructions: [
            'Ngồi trên sàn, nâng chân lên, người hơi ngả ra sau.',
            'Cầm tạ xoay người sang trái rồi sang phải.',
            'Giữ thăng bằng và cảm nhận cơ liên sườn hoạt động.'
        ]
    },
    {
        id: 'core-005',
        name: 'Con Lăn Bụng (Ab Wheel Rollout)',
        target: 'Gym/Bụng',
        equipment: 'Con lăn',
        difficulty: 'advanced',
        primaryMuscle: 'Toàn bộ Core',
        instructions: [
            'Quỳ gối, nắm con lăn trước mặt.',
            'Lăn con lăn về phía trước xa nhất có thể.',
            'Dùng cơ bụng kéo người trở lại vị trí ban đầu.'
        ]
    },

    // --- CARDIO & PLYO ---
    {
        id: 'cardio-001',
        name: 'Burpees',
        target: 'Cardio',
        equipment: 'Bodyweight',
        difficulty: 'advanced',
        primaryMuscle: 'Toàn thân',
        instructions: [
            'Đứng thẳng, sau đó ngồi xổm chống tay xuống đất.',
            'Bật chân ra sau thành tư thế hít đất.',
            'Thực hiện một cái hít đất rồi bật chân thu về.',
            'Bật nhảy lên cao, vỗ tay trên đầu.'
        ]
    },
    {
        id: 'cardio-002',
        name: 'Nhảy Dây (Jump Rope)',
        target: 'Cardio',
        equipment: 'Dây nhảy',
        difficulty: 'beginner',
        primaryMuscle: 'Bắp Chân/Tim Mạch',
        instructions: [
            'Giữ hai tay cầm dây, khuỷu tay sát người.',
            'Bật nhảy nhẹ nhàng bằng mũi chân.',
            'Xoay cổ tay để quay dây đều đặn.'
        ]
    },
    {
        id: 'cardio-003',
        name: 'Leo Núi (Mountain Climbers)',
        target: 'Cardio',
        equipment: 'Bodyweight',
        difficulty: 'intermediate',
        primaryMuscle: 'Bụng/Tim Mạch',
        instructions: [
            'Bắt đầu ở tư thế chống đẩy cao.',
            'Kéo một đầu gối lên phía ngực.',
            'Đổi chân liên tục với tốc độ nhanh.',
            'Giữ lưng thẳng và hông thấp.'
        ]
    },
    // --- KETTLEBELL ---
    {
        id: 'kb-001',
        name: 'Kettlebell Swing',
        target: 'Gym/FullBody',
        equipment: 'Kettlebell',
        difficulty: 'intermediate',
        primaryMuscle: 'Đùi Sau/Mông',
        secondaryMuscles: ['Lưng Dưới', 'Vai'],
        instructions: [
            'Đứng chân rộng hơn vai, cầm tạ ấm bằng hai tay.',
            'Hơi gập gối, đẩy hông ra sau.',
            'Dùng lực hông đẩy tạ vung lên ngang vai.',
            'Để tạ rơi tự do xuống giữa hai chân và lặp lại.'
        ]
    },
    {
        id: 'kb-002',
        name: 'Goblet Squat',
        target: 'Gym/Chân',
        equipment: 'Kettlebell/Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Đùi Trước',
        secondaryMuscles: ['Mông', 'Core'],
        instructions: [
            'Cầm tạ ấm trước ngực, khuỷu tay khép sát.',
            'Xuống tấn sâu, giữ lưng thẳng.',
            'Đầu gối mở theo hướng mũi chân.'
        ]
    },
    {
        id: 'kb-003',
        name: 'Turkish Get Up',
        target: 'Gym/FullBody',
        equipment: 'Kettlebell',
        difficulty: 'advanced',
        primaryMuscle: 'Toàn thân',
        instructions: [
            'Nằm ngửa, một tay giữ tạ thẳng lên trời.',
            'Ngồi dậy, chống tay còn lại xuống sàn.',
            'Nâng hông, luồn chân ra sau để quỳ gối.',
            'Đứng dậy hoàn toàn, tay vẫn giữ tạ thẳng đứng.'
        ]
    },

    // --- ISOLATION & ACCESSORY ---
    {
        id: 'iso-001',
        name: 'Cuốn Cổ Tay (Wrist Curl)',
        target: 'Gym/Tay',
        equipment: 'Tạ đơn/Thanh đòn',
        difficulty: 'beginner',
        primaryMuscle: 'Cẳng Tay',
        instructions: [
            'Đặt cẳng tay lên ghế, cổ tay thò ra ngoài.',
            'Cầm tạ, gập cổ tay lên xuống biên độ tối đa.'
        ]
    },
    {
        id: 'iso-002',
        name: 'Nhún Vai (Shrugs)',
        target: 'Gym/Vai',
        equipment: 'Tạ đơn/Thanh đòn',
        difficulty: 'beginner',
        primaryMuscle: 'Cầu Vai (Traps)',
        instructions: [
            'Đứng thẳng, cầm tạ hai bên hông.',
            'Nhún vai lên cao về phía tai.',
            'Giữ 1 giây rồi hạ xuống.'
        ]
    },
    {
        id: 'iso-003',
        name: 'Banht Chân (Hip Abduction)',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Mông (Glute Medius)',
        instructions: [
            'Ngồi vào máy, đặt chân lên đệm ngoài.',
            'Dùng lực mông đẩy hai chân ra xa nhau.',
            'Khép lại chậm rãi.'
        ]
    },
    {
        id: 'iso-004',
        name: 'Khép Chân (Hip Adduction)',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Đùi Trong',
        instructions: [
            'Ngồi vào máy, đặt chân lên đệm trong.',
            'Dùng lực đùi trong ép hai chân lại gần nhau.'
        ]
    },

    // --- CALISTHENICS ---
    {
        id: 'cali-001',
        name: 'Muscle Up',
        target: 'Gym/FullBody',
        equipment: 'Xà đơn',
        difficulty: 'advanced',
        primaryMuscle: 'Xô/Ngực/Tay Sau',
        instructions: [
            'Kéo xà bùng nổ, đưa ngực qua xà.',
            'Chuyển cổ tay, đẩy người lên tư thế dip.',
            'Đẩy thẳng tay ở điểm cao nhất.'
        ]
    },
    {
        id: 'cali-002',
        name: 'Pistol Squat',
        target: 'Gym/Chân',
        equipment: 'Bodyweight',
        difficulty: 'advanced',
        primaryMuscle: 'Đùi Trước/Mông',
        instructions: [
            'Đứng một chân, chân kia duỗi thẳng ra trước.',
            'Squat xuống sâu nhất có thể bằng một chân.',
            'Giữ thăng bằng và đứng dậy.'
        ]
    },
    {
        id: 'cali-003',
        name: 'Dragon Flag',
        target: 'Gym/Bụng',
        equipment: 'Ghế tập',
        difficulty: 'advanced',
        primaryMuscle: 'Bụng/Core',
        instructions: [
            'Nằm trên ghế, tay nắm mép ghế sau đầu.',
            'Nâng toàn bộ cơ thể lên thẳng đứng bằng vai.',
            'Hạ xuống từ từ, giữ người thẳng như cây thước.'
        ]
    },

    // --- COMPOUND VARIATIONS ---
    {
        id: 'var-001',
        name: 'Sumo Deadlift',
        target: 'Gym/Chân',
        equipment: 'Thanh đòn',
        difficulty: 'intermediate',
        primaryMuscle: 'Mông/Đùi Trong',
        secondaryMuscles: ['Lưng Dưới'],
        instructions: [
            'Chân đứng rộng hơn vai, mũi chân xoay ra ngoài.',
            'Tay nắm thanh đòn hẹp hơn chân.',
            'Giữ lưng thẳng, đạp sàn để nâng tạ.'
        ]
    },
    {
        id: 'var-002',
        name: 'Front Squat (Squat Trước)',
        target: 'Gym/Chân',
        equipment: 'Thanh đòn',
        difficulty: 'advanced',
        primaryMuscle: 'Đùi Trước',
        secondaryMuscles: ['Upper Back', 'Core'],
        instructions: [
            'Thanh đòn đặt trên vai trước, khuỷu tay nâng cao.',
            'Squat xuống sâu, giữ lưng cực kỳ thẳng.',
            'Tránh để khuỷu tay hạ thấp.'
        ]
    },
    {
        id: 'var-003',
        name: 'Zercher Squat',
        target: 'Gym/Chân',
        equipment: 'Thanh đòn',
        difficulty: 'advanced',
        primaryMuscle: 'Đùi Trước/Core',
        instructions: [
            'Đặt thanh đòn vào khuỷu tay gập lại.',
            'Khóa chặt tay trước ngực.',
            'Squat xuống, giữ thanh đòn sát người.'
        ]
    },
    {
        id: 'var-004',
        name: 'Deficit Deadlift',
        target: 'Gym/Lưng',
        equipment: 'Thanh đòn + Bục',
        difficulty: 'advanced',
        primaryMuscle: 'Lưng/Đùi Sau',
        instructions: [
            'Đứng trên một tấm tạ hoặc bục thấp (2-5cm).',
            'Thực hiện Deadlift như bình thường.',
            'Tăng phạm vi chuyển động để kích thích nhiều hơn.'
        ]
    },

    // --- STRETCHING & YOGA ---
    {
        id: 'str-001',
        name: 'Giãn Cơ Cổ (Neck Stretch)',
        target: 'Gym/Stretching',
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        primaryMuscle: 'Cổ',
        instructions: [
            'Nghiêng đầu sang phải, dùng tay phải kéo nhẹ.',
            'Giữ 15-30 giây.',
            'Đổi bên.'
        ]
    },
    {
        id: 'str-002',
        name: 'Giãn Cơ Vai (Shoulder Stretch)',
        target: 'Gym/Stretching',
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        primaryMuscle: 'Vai',
        instructions: [
            'Đưa một tay qua ngực.',
            'Dùng tay kia ép sát tay này vào người.',
            'Giữ 15-30 giây.'
        ]
    },
    {
        id: 'str-003',
        name: 'Tư Thế Em Bé (Child\'s Pose)',
        target: 'Yoga',
        equipment: 'Thảm tập',
        difficulty: 'beginner',
        primaryMuscle: 'Lưng Dưới',
        secondaryMuscles: ['Hông', 'Vai'],
        instructions: [
            'Quỳ gối trên sàn, mông chạm gót chân.',
            'Vươn dài hai tay ra phía trước, trán chạm thảm.',
            'Thả lỏng toàn bộ cơ thể hít thở sâu.'
        ]
    },
    {
        id: 'str-004',
        name: 'Tư Thế Chó Úp Mặt (Downward Dog)',
        target: 'Yoga',
        equipment: 'Thảm tập',
        difficulty: 'beginner',
        primaryMuscle: 'Gân Kheo (Hamstrings)',
        secondaryMuscles: ['Vai', 'Bắp Chân'],
        instructions: [
            'Chống hai tay và hai chân xuống sàn.',
            'Đẩy hông lên cao tạo thành chữ V ngược.',
            'Cố gắng giữ thẳng lưng và chân.'
        ]
    },
    {
        id: 'str-005',
        name: 'Tư Thế Rắn Hổ Mang (Cobra)',
        target: 'Yoga',
        equipment: 'Thảm tập',
        difficulty: 'beginner',
        primaryMuscle: 'Lưng Dưới/Bụng',
        instructions: [
            'Nằm sấp, hai tay chống cạnh ngực.',
            'Đẩy thẳng tay, nâng ngực lên cao.',
            'Mở rộng vai và nhìn thẳng.'
        ]
    },
    {
        id: 'str-006',
        name: 'Tư Thế Chiến Binh 1 (Warrior I)',
        target: 'Yoga',
        equipment: 'Thảm tập',
        difficulty: 'intermediate',
        primaryMuscle: 'Chân/Hông',
        instructions: [
            'Bước một chân dài về phía trước, gập gối vuông góc.',
            'Chân sau duỗi thẳng, bàn chân xoay 45 độ.',
            'Vươn hai tay lên cao, mắt nhìn theo tay.'
        ]
    },
    {
        id: 'str-007',
        name: 'Giãn Cơ Tứ Đầu (Quad Stretch)',
        target: 'Gym/Stretching',
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        primaryMuscle: 'Đùi Trước',
        instructions: [
            'Đứng thẳng, co một chân ra sau.',
            'Dùng tay cùng bên nắm lấy cổ chân, kéo gót về mông.',
            'Giữ đầu gối hướng xuống sàn.'
        ]
    },
    {
        id: 'str-008',
        name: 'Xoay Cột Sống (Spinal Twist)',
        target: 'Yoga',
        equipment: 'Thảm tập',
        difficulty: 'beginner',
        primaryMuscle: 'Lưng/Cột Sống',
        instructions: [
            'Nằm ngửa, co một chân lên ngực.',
            'Đưa chân đó qua bên đối diện, tay dang ngang.',
            'Mắt nhìn về phía tay ngược lại.'
        ]
    },
    // --- CABLE EXERCISES ---
    {
        id: 'cab-001',
        name: 'Kéo Cáp Tập Tay Sau (Tricep Pushdown)',
        target: 'Gym/Tay',
        equipment: 'Máy cáp',
        difficulty: 'beginner',
        primaryMuscle: 'Tay Sau',
        secondaryMuscles: ['Vai'],
        instructions: [
            'Đứng thẳng, nắm thanh đòn ngang hoặc dây thừng.',
            'Giữ khuỷu tay cố định bên sườn.',
            'Ép mạnh tay xuống cho đến khi thẳng hết cỡ, thở ra.',
            'Từ từ đưa tay lên vị trí ban đầu, hít vào.'
        ]
    },
    {
        id: 'cab-002',
        name: 'Cuốn Tay Trước Với Cáp (Cable Curl)',
        target: 'Gym/Tay',
        equipment: 'Máy cáp',
        difficulty: 'beginner',
        primaryMuscle: 'Tay Trước',
        instructions: [
            'Đứng thẳng, cầm thanh đòn nối với cáp thấp.',
            'Cuốn tay lên phía vai, giữ khuỷu tay cố định.',
            'Siết chặt cơ bắp tay ở điểm cao nhất.'
        ]
    },
    {
        id: 'cab-003',
        name: 'Kéo Cáp Tập Ngực (Cable Fly)',
        target: 'Gym/Ngực',
        equipment: 'Máy cáp',
        difficulty: 'intermediate',
        primaryMuscle: 'Ngực',
        secondaryMuscles: ['Vai Trước'],
        instructions: [
            'Đứng giữa hai ròng rọc cáp cao.',
            'Kéo hai tay về phía trước ngực, hơi gập khuỷu tay.',
            'Ép chặt cơ ngực ở điểm giữa, cảm nhận sự co thắt.',
            'Mở rộng tay về sau từ từ để giãn cơ.'
        ]
    },
    {
        id: 'cab-004',
        name: 'Kéo Cáp Mặt (Face Pull)',
        target: 'Gym/Vai',
        equipment: 'Máy cáp',
        difficulty: 'intermediate',
        primaryMuscle: 'Vai Sau',
        secondaryMuscles: ['Cầu Vai', 'Chóp Xoay (Rotator Cuff)'],
        instructions: [
            'Lắp dây thừng vào ròng rọc cao ngang mặt.',
            'Kéo dây về phía mặt, tách hai đầu dây sang hai bên tai.',
            'Ép bả vai lại phía sau, khuỷu tay cao hơn vai.',
            'Bài tập tuyệt vời để sửa tư thế gù lưng và bảo vệ khớp vai.'
        ]
    },
    {
        id: 'cab-005',
        name: 'Gập Bụng Với Cáp (Cable Crunch)',
        target: 'Gym/Bụng',
        equipment: 'Máy cáp',
        difficulty: 'intermediate',
        primaryMuscle: 'Cơ Bụng 6 Múi',
        instructions: [
            'Quỳ gối trước máy cáp, nắm dây thừng đặt sau gáy.',
            'Gập người xuống bằng cơ bụng, cố gắng chạm khuỷu tay vào đùi.',
            'Hít vào khi nâng người lên, thở ra mạnh khi gập xuống.'
        ]
    },

    // --- MACHINE EXERCISES ---
    {
        id: 'mac-001',
        name: 'Đạp Đùi (Leg Press)',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Đùi Trước',
        secondaryMuscles: ['Mông', 'Đùi Sau'],
        instructions: [
            'Ngồi vào ghế, đặt chân lên bàn đạp rộng bằng vai.',
            'Tháo chốt an toàn, hạ bàn đạp xuống cho đến khi đùi gần chạm ngực.',
            'Đạp mạnh lên nhưng KHÔNG khóa khớp gối hoàn toàn.',
            'Thở ra khi đạp lên, hít vào khi hạ xuống.'
        ]
    },
    {
        id: 'mac-002',
        name: 'Đá Đùi Trước (Leg Extension)',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Đùi Trước',
        instructions: [
            'Ngồi vào máy, đặt cổ chân dưới đệm mút.',
            'Đá chân lên thẳng tắp, siết chặt cơ đùi.',
            'Hạ xuống từ từ có kiểm soát.'
        ]
    },
    {
        id: 'mac-003',
        name: 'Móc Đùi Sau (Leg Curl)',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Đùi Sau',
        instructions: [
            'Nằm sấp hoặc ngồi (tùy máy), đặt gót chân dưới đệm.',
            'Cuốn gót chân về phía mông nhanh và dứt khoát.',
            'Duỗi ra chậm rãi để cảm nhận cơ giãn.'
        ]
    },
    {
        id: 'mac-004',
        name: 'Ép Ngực Máy (Pec Deck / Machine Fly)',
        target: 'Gym/Ngực',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Ngực Trong',
        instructions: [
            'Ngồi thẳng, đặt tay lên hai pad đệm.',
            'Ép hai tay lại gần nhau trước ngực.',
            'Giữ 1 giây rồi mở ra từ từ.'
        ]
    },
    {
        id: 'mac-005',
        name: 'Đẩy Vai Máy (Machine Shoulder Press)',
        target: 'Gym/Vai',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        primaryMuscle: 'Vai Trước',
        secondaryMuscles: ['Tay Sau'],
        instructions: [
            'Điều chỉnh ghế sao cho tay cầm ngang vai.',
            'Đẩy thẳng lên cao qua đầu.',
            'Hạ xuống ngang tai rồi đẩy tiếp.'
        ]
    },

    // --- DUMBBELL EXERCISES ---
    {
        id: 'db-001',
        name: 'Đẩy Ngực Trên Tạ Đơn (Incline DB Press)',
        target: 'Gym/Ngực',
        equipment: 'Tạ đơn',
        difficulty: 'intermediate',
        primaryMuscle: 'Ngực Trên',
        secondaryMuscles: ['Vai Trước', 'Tay Sau'],
        instructions: [
            'Điều chỉnh ghế dốc lên 30-45 độ.',
            'Cầm tạ đơn, đẩy thẳng lên trần nhà.',
            'Hạ xuống sâu để kéo giãn ngực trên.',
            'Thở ra khi đẩy, hít khi hạ.'
        ]
    },
    {
        id: 'db-002',
        name: 'Bay Vai (Lateral Raise)',
        target: 'Gym/Vai',
        equipment: 'Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Vai Giữa',
        instructions: [
            'Đứng thẳng, cầm tạ hai bên hông.',
            'Nâng tạ sang hai bên cho đến khi ngang vai.',
            'Hơi đổ nước (ngón út cao hơn ngón cái) để vào vai tốt hơn.',
            'Hạ xuống chậm, không thả rơi tạ.'
        ]
    },
    {
        id: 'db-003',
        name: 'Chèo Tạ Đơn 1 Tay (One Arm DB Row)',
        target: 'Gym/Lưng',
        equipment: 'Tạ đơn',
        difficulty: 'intermediate',
        primaryMuscle: 'Xô (Lats)',
        secondaryMuscles: ['Tay Trước', 'Lưng Giữa'],
        instructions: [
            'Chống một tay và đầu gối lên ghế phẳng.',
            'Tay còn lại cầm tạ, kéo tạ về phía hông.',
            'Giữ lưng thẳng, không xoay người quá nhiều.',
            'Cảm nhận bả vai di chuyển.'
        ]
    },
    {
        id: 'db-004',
        name: 'Tấn Trước (Walking Lunges)',
        target: 'Gym/Chân',
        equipment: 'Tạ đơn',
        difficulty: 'intermediate',
        primaryMuscle: 'Đùi',
        secondaryMuscles: ['Mông', 'Bắp Chân'],
        instructions: [
            'Cầm 2 quả tạ đơn, bước chân dài về phía trước.',
            'Hạ trọng tâm sao cho 2 đầu gối vuông góc 90 độ.',
            'Đứng dậy và bước tiếp chân kia.'
        ]
    },
    {
        id: 'db-005',
        name: 'Cuốn Búa (Hammer Curl)',
        target: 'Gym/Tay',
        equipment: 'Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Tay Trước (Brachialis)',
        secondaryMuscles: ['Cẳng Tay'],
        instructions: [
            'Cầm tạ đơn, lòng bàn tay hướng vào thân người (kiểu cầm búa).',
            'Cuốn tạ lên vai, giữ nguyên cổ tay.',
            'Tốt cho việc làm dày bắp tay và phát triển cẳng tay.'
        ]
    },
    {
        id: 'db-006',
        name: 'Nhún Vai (Dumbbell Shrug)',
        target: 'Gym/Vai',
        equipment: 'Tạ đơn',
        difficulty: 'beginner',
        primaryMuscle: 'Cầu Vai (Traps)',
        instructions: [
            'Cầm tạ nặng hai bên.',
            'Nhún vai lên cao về phía tai.',
            'Giữ 1 giây ở trên đỉnh rồi hạ xuống.',
            'Không xoay vai, chỉ nhún lên xuống.'
        ]
    },

    // --- ABS & CORE ---
    {
        id: 'abs-001',
        name: 'Plank (Tấm Ván)',
        target: 'Gym/Bụng',
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        primaryMuscle: 'Cơ Bụng Dọc',
        secondaryMuscles: ['Ổn định toàn thân'],
        instructions: [
            'Chống khuỷu tay vuông góc dưới vai.',
            'Giữ thân người thẳng như tấm ván từ đầu đến gót chân.',
            'Siết chặt bụng, mông và đùi. Không võng lưng.',
            'Hít thở đều, giữ càng lâu càng tốt.'
        ]
    },
    {
        id: 'abs-002',
        name: 'Đạp Xe (Bicycle Crunches)',
        target: 'Gym/Bụng',
        equipment: 'Bodyweight',
        difficulty: 'intermediate',
        primaryMuscle: 'Cơ Bụng Chéo (Obliques)',
        instructions: [
            'Nằm ngửa, tay để sau đầu.',
            'Co gối trái lên đồng thời xoay người để khuỷu tay phải chạm gối trái.',
            'Đổi bên liên tục như đang đạp xe.',
            'Động tác chậm rãi để cảm nhận cơ.'
        ]
    },
    {
        id: 'abs-003',
        name: 'Treo Người Nâng Chân (Hanging Leg Raise)',
        target: 'Gym/Bụng',
        equipment: 'Xà đơn',
        difficulty: 'advanced',
        primaryMuscle: 'Bụng Dưới',
        instructions: [
            'Treo người trên xà đơn.',
            'Dùng cơ bụng dưới cuốn xương chậu lên, nâng chân cao ngang hông.',
            'Hạ xuống chậm, tránh đung đưa người.'
        ]
    }
];

export const CALCULATORS = [
    { id: '1rm', name: '1 Rep Max', desc: 'Sức mạnh tối đa' },
    { id: 'bmi', name: 'BMI / Body Fat', desc: 'Chỉ số cơ thể' },
    { id: 'water', name: 'Theo Dõi Nước', desc: 'Theo dõi nước' },
    { id: 'macro', name: 'TDEE & Macro', desc: 'Dinh dưỡng' },
    { id: 'plate', name: 'Tính Bánh Tạ', desc: 'Tính tạ' },
];
