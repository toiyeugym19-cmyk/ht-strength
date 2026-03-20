export interface Exercise {
    id: string;
    name: string;
    nameEn?: string;
    target: string;
    equipment: string;
    gifUrl?: string;
    videoUrl?: string;
    instructions: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category?: 'strength' | 'cardio' | 'stretching' | 'plyometric' | 'calisthenics';
    primaryMuscle?: string;
    secondaryMuscles?: string[];
    tips?: string[];
    commonMistakes?: string[];
    suggestedSets?: string;
    restSeconds?: number;
    caloriesPer10Min?: number;
    variations?: string[];
    supersetWith?: string[];
}

export const EXERCISE_DB: Exercise[] = [
    // Chest
    {
        id: 'chest-001',
        name: 'Đẩy Ngực Ngang (Barbell)',
        nameEn: 'Barbell Bench Press',
        target: 'Gym/Ngực',
        equipment: 'Thanh đòn',
        difficulty: 'intermediate',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/00251kr.gif',
        videoUrl: '/videos/exercises/bench-press.mp4',
        primaryMuscle: 'Cơ Ngực Lớn',
        secondaryMuscles: ['Tay Sau', 'Vai Trước'],
        instructions: [
            'Nằm thẳng trên ghế, mắt dưới thanh đòn.',
            'Nắm thanh đòn rộng hơn vai một chút.',
            'Hạ tạ xuống giữa ngực trong khi hít vào.',
            'Đẩy tạ lên mạnh mẽ trong khi thở ra.'
        ],
        tips: [
            'Ép bả vai lại và xuống ghế để tạo vòm ngực tự nhiên',
            'Giữ cổ tay thẳng hàng với cẳng tay, không gập ngược',
            'Hít vào khi hạ tạ, thở ra mạnh khi đẩy lên'
        ],
        commonMistakes: [
            'Bật mông khỏi ghế khi đẩy nặng',
            'Hạ tạ quá nhanh không kiểm soát',
            'Nắm thanh đòn quá rộng gây áp lực lên vai'
        ],
        suggestedSets: '4 sets × 6-10 reps',
        restSeconds: 120,
        caloriesPer10Min: 85,
        variations: ['Đẩy ngực tạ đơn', 'Đẩy ngực trên dốc', 'Close Grip Bench Press']
    },


    // Back
    {
        id: 'back-001',
        name: 'Hít Xà Đơn',
        nameEn: 'Pull Up',
        target: 'Gym/Lưng',
        equipment: 'Bodyweight',
        difficulty: 'advanced',
        category: 'calisthenics',
        gifUrl: 'https://static.exercisedb.dev/media/06521kr.gif',
        videoUrl: '/videos/exercises/pull-up.mp4',
        primaryMuscle: 'Xô (Lats)',
        secondaryMuscles: ['Tay Trước (Biceps)', 'Lưng Giữa'],
        instructions: [
            'Treo người trên xà với tay rộng hơn vai.',
            'Kéo ngực lên phía xà bằng cách ép khuỷu tay xuống.',
            'Hạ xuống có kiểm soát cho đến khi tay duỗi thẳng.'
        ],
        tips: [
            'Bắt đầu từ tư thế treo hoàn toàn, tay duỗi thẳng',
            'Tập trung kéo bằng cơ lưng, không phải tay',
            'Nếu chưa kéo được, dùng dây kháng lực hỗ trợ'
        ],
        commonMistakes: [
            'Không kéo hết biên độ, cằm không qua xà',
            'Đung đưa người để lấy đà',
            'Chỉ dùng lực tay mà không kích hoạt cơ lưng'
        ],
        suggestedSets: '3-4 sets × 5-12 reps',
        restSeconds: 120,
        caloriesPer10Min: 90,
        variations: ['Chin Up', 'Wide Grip Pull Up', 'Assisted Pull Up']
    },
    {
        id: 'back-003',
        name: 'Kéo Xà Cáp (Lat Pulldown)',
        nameEn: 'Lat Pulldown',
        target: 'Gym/Lưng',
        equipment: 'Máy cáp',
        difficulty: 'beginner',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/04931kr.gif',
        videoUrl: '/videos/exercises/lat-pulldown.mp4',
        primaryMuscle: 'Xô (Lats)',
        secondaryMuscles: ['Tay Trước (Biceps)', 'Lưng Trên'],
        instructions: [
            'Ngồi vào máy, nắm thanh đòn rộng tay.',
            'Kéo thanh đòn xuống phía ngực trên, hơi ngả người ra sau.',
            'Siết cơ xô ở điểm thấp nhất và thả từ từ.'
        ],
        tips: [
            'Ngả người ra sau khoảng 15-20 độ khi kéo',
            'Kéo thanh đòn về phía ngực trên, không phải sau cổ',
            'Siết bả vai lại ở điểm thấp nhất'
        ],
        commonMistakes: [
            'Kéo thanh đòn ra sau gáy gây chấn thương vai',
            'Dùng đà đung đưa thân người quá nhiều',
            'Nắm thanh đòn quá hẹp hoặc quá rộng'
        ],
        suggestedSets: '3-4 sets × 8-12 reps',
        restSeconds: 90,
        caloriesPer10Min: 65,
        variations: ['Close Grip Pulldown', 'Reverse Grip Pulldown', 'Single Arm Pulldown']
    },
    {
        id: 'back-004',
        name: 'Deadlift (Kéo Tạ)',
        nameEn: 'Deadlift',
        target: 'Gym/Lưng',
        equipment: 'Thanh đòn',
        difficulty: 'advanced',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/00321kr.gif',
        videoUrl: '/videos/exercises/deadlift.mp4',
        primaryMuscle: 'Lưng Dưới',
        secondaryMuscles: ['Đùi Sau', 'Mông', 'Cầu Vai'],
        instructions: [
            'Đứng với giữa bàn chân dưới thanh đòn.',
            'Gập hông và gối, nắm lấy thanh đòn.',
            'Nâng tạ bằng cách duỗi hông và gối, giữ thanh đòn sát cơ thể.',
            'Đứng thẳng, sau đó hạ tạ xuống sàn.'
        ],
        tips: [
            'Giữ thanh đòn sát cơ thể trong suốt động tác',
            'Hít một hơi sâu trước khi kéo để cố định core',
            'Đẩy sàn bằng chân thay vì kéo bằng lưng'
        ],
        commonMistakes: [
            'Cong lưng khi kéo tạ nặng',
            'Để thanh đòn xa cơ thể',
            'Nâng bằng lưng dưới thay vì dùng hông và chân'
        ],
        suggestedSets: '3-5 sets × 3-6 reps',
        restSeconds: 180,
        caloriesPer10Min: 100,
        variations: ['Sumo Deadlift', 'Romanian Deadlift', 'Trap Bar Deadlift']
    },

    // Legs
    {
        id: 'leg-001',
        name: 'Gánh Tạ (Squat)',
        nameEn: 'Barbell Back Squat',
        target: 'Gym/Chân',
        equipment: 'Thanh đòn',
        difficulty: 'advanced',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/00271kr.gif',
        videoUrl: '/videos/exercises/squat.mp4',
        primaryMuscle: 'Đùi Trước',
        secondaryMuscles: ['Mông', 'Đùi Sau', 'Core'],
        instructions: [
            'Thanh đòn nằm trên cầu vai, chân rộng bằng vai.',
            'Ngồi xuống và ra sau cho đến khi đùi song song với sàn.',
            'Đạp mạnh gót chân để đứng dậy.'
        ],
        tips: [
            'Giữ ngực ưỡn và mắt nhìn thẳng phía trước',
            'Đẩy đầu gối ra ngoài theo hướng mũi chân',
            'Hít sâu vào bụng trước khi ngồi xuống'
        ],
        commonMistakes: [
            'Gối chụm vào trong khi đứng lên',
            'Không ngồi đủ sâu (dưới song song)',
            'Nâng gót chân khỏi sàn'
        ],
        suggestedSets: '4 sets × 5-8 reps',
        restSeconds: 150,
        caloriesPer10Min: 95,
        variations: ['Front Squat', 'Goblet Squat', 'Box Squat']
    },



    // Shoulders


    // Arms


    {
        id: 'chest-005',
        name: 'Đẩy Ngực Trên',
        nameEn: 'Incline Barbell Bench Press',
        target: 'Gym/Ngực',
        equipment: 'Thanh đòn',
        difficulty: 'intermediate',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/PG1kcIb.gif',
        primaryMuscle: 'Ngực Trên',
        secondaryMuscles: ['Tay Sau', 'Vai Trước'],
        instructions: [
            'Ghế dốc 30-45 độ.',
            'Hạ thanh đòn xuống ngực trên.',
            'Đẩy lên, tập trung vào việc co cơ ngực trên.'
        ],
        tips: [
            'Chỉnh ghế dốc 30 độ để tối ưu cho ngực trên',
            'Hạ thanh đòn về phía xương đòn',
            'Đẩy chân xuống sàn để tạo lực ổn định'
        ],
        commonMistakes: [
            'Chỉnh ghế quá dốc biến thành đẩy vai',
            'Bật tạ khỏi ngực thay vì đẩy có kiểm soát',
            'Nắm tay quá rộng gây đau vai'
        ],
        suggestedSets: '4 sets × 8-10 reps',
        restSeconds: 120,
        caloriesPer10Min: 80,
        variations: ['Incline Dumbbell Press', 'Low Incline Bench Press', 'Incline Smith Machine Press']
    },
    {
        id: 'back-005',
        name: 'Chèo Tạ Đơn (Dumbbell Row)',
        nameEn: 'Dumbbell Row',
        target: 'Gym/Lưng',
        equipment: 'Tạ đơn',
        difficulty: 'intermediate',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/C0MA9bC.gif',
        primaryMuscle: 'Xô (Lats)',
        secondaryMuscles: ['Lưng Giữa', 'Tay Trước'],
        instructions: [
            'Một tay và đầu gối đặt trên ghế.',
            'Kéo tạ về phía hông, giữ khuỷu tay sát người.',
            'Siết bả vai ở điểm cao nhất.'
        ],
        tips: [
            'Kéo tạ về phía hông, không phải ngực',
            'Giữ lưng thẳng song song với sàn',
            'Siết bả vai ở điểm cao nhất 1 giây'
        ],
        commonMistakes: [
            'Xoay thân người để lấy đà',
            'Kéo tạ bằng tay thay vì cơ lưng',
            'Không kéo hết biên độ'
        ],
        suggestedSets: '3-4 sets × 8-12 reps',
        restSeconds: 90,
        caloriesPer10Min: 70,
        variations: ['Barbell Row', 'Seated Cable Row', 'Meadows Row']
    },
    {
        id: 'leg-004',
        name: 'Đạp Đùi (Leg Press)',
        nameEn: 'Leg Press',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/7zdxRTl.gif',
        primaryMuscle: 'Đùi Trước',
        secondaryMuscles: ['Mông', 'Đùi Sau'],
        instructions: [
            'Chân đặt rộng bằng vai trên bàn đạp.',
            'Hạ xuống cho đến khi gối gập 90 độ.',
            'Đẩy lên nhưng không khóa khớp gối.'
        ],
        tips: [
            'Đặt chân cao trên bàn đạp để nhắm vào mông nhiều hơn',
            'Không khóa khớp gối ở đỉnh',
            'Hạ từ từ cho đến khi gối gập 90 độ'
        ],
        commonMistakes: [
            'Khóa khớp gối thẳng hoàn toàn',
            'Đặt chân quá thấp gây áp lực lên gối',
            'Nâng mông khỏi ghế khi hạ quá sâu'
        ],
        suggestedSets: '3-4 sets × 10-15 reps',
        restSeconds: 90,
        caloriesPer10Min: 75,
        variations: ['Single Leg Press', 'Wide Stance Leg Press', 'Hack Squat']
    },
    {
        id: 'leg-005',
        name: 'Romanian Deadlift (RDL)',
        nameEn: 'Romanian Deadlift',
        target: 'Gym/Chân',
        equipment: 'Thanh đòn',
        difficulty: 'intermediate',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/wQ2c4XD.gif',
        primaryMuscle: 'Đùi Sau',
        secondaryMuscles: ['Mông', 'Lưng Dưới'],
        instructions: [
            'Đứng thẳng với thanh đòn.',
            'Gập hông, hạ thanh đòn dọc theo chân.',
            'Cảm nhận độ căng ở đùi sau và trở lại vị trí đứng.'
        ],
        tips: [
            'Giữ thanh đòn luôn sát chân trong suốt động tác',
            'Đẩy hông ra sau thay vì cúi lưng xuống',
            'Cảm nhận cơ đùi sau căng mạnh khi hạ'
        ],
        commonMistakes: [
            'Cong lưng khi hạ tạ xuống',
            'Gập gối quá nhiều biến thành Squat',
            'Hạ tạ quá thấp vượt quá khả năng linh hoạt'
        ],
        suggestedSets: '3-4 sets × 8-12 reps',
        restSeconds: 120,
        caloriesPer10Min: 80,
        variations: ['Single Leg RDL', 'Dumbbell RDL', 'Stiff Leg Deadlift']
    },

    // Core

    {
        id: 'core-002',
        name: 'Treo Người Đá Bụng',
        nameEn: 'Hanging Leg Raise',
        target: 'Gym/Bụng',
        equipment: 'Xà đơn',
        difficulty: 'intermediate',
        category: 'calisthenics',
        gifUrl: 'https://static.exercisedb.dev/media/0V2YQjW.gif',
        primaryMuscle: 'Bụng Dưới',
        instructions: [
            'Treo người trên xà, chân duỗi thẳng.',
            'Nâng chân lên cho đến khi song song với sàn.',
            'Hạ xuống chậm rãi, tránh đung đưa.'
        ],
        tips: [
            'Cuộn xương chậu lên để kích hoạt bụng dưới',
            'Nếu khó quá, bắt đầu với gập gối thay vì duỗi thẳng',
            'Hạ chân xuống từ từ, đừng để rơi tự do'
        ],
        commonMistakes: [
            'Đung đưa thân người để lấy đà',
            'Chỉ nâng chân mà không cuộn hông',
            'Dùng lực cơ hông gập thay vì cơ bụng'
        ],
        suggestedSets: '3 sets × 10-15 reps',
        restSeconds: 60,
        caloriesPer10Min: 60,
        variations: ['Knee Raise', 'Toes to Bar', 'Captain Chair Leg Raise']
    },
    // --- CHEST EXPANSION ---
    {
        id: 'chest-006',
        name: 'Đẩy Ngực Dốc Lên (Incline Dumbbell Press)',
        nameEn: 'Incline Dumbbell Press',
        target: 'Gym/Ngực',
        equipment: 'Tạ đơn',
        difficulty: 'intermediate',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/PG1kcIb.gif',
        primaryMuscle: 'Ngực Trên',
        secondaryMuscles: ['Vai Trước', 'Tay Sau'],
        instructions: [
            'Nằm trên ghế dốc 30-45 độ, cầm tạ đơn.',
            'Đẩy tạ thẳng lên trên ngực, hai lòng bàn tay hướng vào nhau hoặc về phía trước.',
            'Hạ tạ xuống chậm rãi cho đến khi ngang ngực.'
        ],
        tips: [
            'Chỉnh ghế 30 độ để nhắm ngực trên, không quá dốc',
            'Hạ tạ xuống ngang ngực trên, khuỷu tay hơi thấp hơn vai',
            'Siết ngực ở đỉnh 1 giây trước khi hạ'
        ],
        commonMistakes: [
            'Ghế quá dốc biến thành đẩy vai',
            'Hạ tạ quá thấp gây đau vai',
            'Đẩy hai tạ không đều'
        ],
        suggestedSets: '4 sets × 8-12 reps',
        restSeconds: 90,
        caloriesPer10Min: 70,
        variations: ['Incline Barbell Press', 'Low Incline DB Press', 'Neutral Grip Incline']
    },

    {
        id: 'chest-008',
        name: 'Xà Kép (Dips)',
        nameEn: 'Chest Dips',
        target: 'Gym/Ngực',
        equipment: 'Xà kép',
        difficulty: 'advanced',
        category: 'calisthenics',
        gifUrl: 'https://static.exercisedb.dev/media/LkoAWAE.gif',
        primaryMuscle: 'Ngực Dưới',
        secondaryMuscles: ['Tay Sau', 'Vai Trước'],
        instructions: [
            'Nắm hai thanh xà, nâng người lên.',
            'Hơi đổ người về phía trước để tập trung vào ngực.',
            'Hạ người xuống cho đến khi khuỷu tay gập 90 độ.',
            'Đẩy ngược lên vị trí ban đầu.'
        ],
        tips: [
            'Đổ người về trước 15-20 độ để nhắm ngực',
            'Hạ chậm, kiểm soát; không rơi xuống',
            'Nếu đau vai, thu hẹp tay hoặc dùng dây kháng lực hỗ trợ'
        ],
        commonMistakes: [
            'Hạ quá sâu gây đau vai',
            'Đứng thẳng quá, tập trung vào tay sau thay vì ngực',
            'Đung đưa chân để lấy đà'
        ],
        suggestedSets: '3-4 sets × 6-12 reps',
        restSeconds: 120,
        caloriesPer10Min: 75,
        variations: ['Bench Dip', 'Assisted Dips', 'Weighted Dips']
    },
    {
        id: 'chest-009',
        name: 'Hít Đất (Push Up)',
        nameEn: 'Push Up',
        target: 'Gym/Ngực',
        equipment: 'Bodyweight',
        difficulty: 'beginner',
        gifUrl: 'https://static.exercisedb.dev/media/07041kr.gif',
        category: 'calisthenics',
        primaryMuscle: 'Cơ Ngực Lớn',
        secondaryMuscles: ['Tay Sau', 'Vai Trước', 'Core'],
        instructions: [
            'Chống tay xuống sàn, rộng hơn vai.',
            'Giữ thân người thẳng từ đầu đến gót chân.',
            'Hạ người xuống cho đến khi ngực gần chạm sàn.',
            'Đẩy người lên trở lại.'
        ],
        tips: [
            'Siết bụng và mông để giữ thân thẳng',
            'Khuỷu tay hơi chếch 45 độ, không xòe ngang',
            'Hạ chậm 2-3 giây, đẩy lên 1 giây'
        ],
        commonMistakes: [
            'Hông xệ hoặc mông nhô cao',
            'Đầu cúi xuống hoặc ngửa lên',
            'Không hạ đủ sâu (ngực gần sàn)'
        ],
        suggestedSets: '3-4 sets × 10-20 reps',
        restSeconds: 60,
        caloriesPer10Min: 65,
        videoUrl: '/videos/exercises/push-up.mp4',
        variations: ['Diamond Push Up', 'Wide Push Up', 'Decline Push Up', 'Knee Push Up']
    },

    // --- BACK EXPANSION ---
    {
        id: 'back-006',
        name: 'Chèo Cáp Ngồi (Seated Cable Row)',
        nameEn: 'Seated Cable Row',
        target: 'Gym/Lưng',
        equipment: 'Máy cáp',
        difficulty: 'intermediate',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/hvV79Si.gif',
        primaryMuscle: 'Lưng Giữa',
        secondaryMuscles: ['Xô', 'Tay Trước', 'Vai Sau'],
        instructions: [
            'Ngồi thẳng lưng, chân đặt lên đệm đỡ.',
            'Kéo tay cầm về phía bụng dưới, ép bả vai lại.',
            'Không đung đưa người quá nhiều, thả tạ có kiểm soát.'
        ],
        tips: [
            'Kéo về phía rốn/bụng dưới, không phải ngực',
            'Ép hai bả vai lại với nhau ở điểm cuối',
            'Giữ ngực ưỡn, không cúi gập'
        ],
        commonMistakes: [
            'Đung đưa thân người để kéo tạ nặng',
            'Kéo tay cầm về ngực quá cao',
            'Thả tạ quá nhanh không kiểm soát'
        ],
        suggestedSets: '3-4 sets × 8-12 reps',
        restSeconds: 90,
        caloriesPer10Min: 60,
        variations: ['V-Bar Row', 'Wide Grip Row', 'Single Arm Cable Row']
    },
    {
        id: 'back-007',
        name: 'Chèo Tạ Đòn Chữ T (T-Bar Row)',
        nameEn: 'T-Bar Row',
        target: 'Gym/Lưng',
        equipment: 'Máy tập/Thanh đòn',
        difficulty: 'intermediate',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/BgljGjd.gif',
        primaryMuscle: 'Lưng Giữa',
        secondaryMuscles: ['Xô', 'Tay Trước'],
        instructions: [
            'Đứng trên bục máy T-Bar hoặc setup thanh đòn.',
            'Giữ lưng thẳng, gập hông 45 độ.',
            'Kéo tạ về phía ngực, ép chặt cơ lưng.',
            'Hạ tạ xuống cho đến khi tay duỗi thẳng.'
        ],
        tips: [
            'Giữ lưng thẳng hoặc hơi ưỡn, không cong',
            'Kéo thanh chạm ngực giữa, ép bả vai',
            'Dùng đệm kê ngực nếu có để cô lập lưng'
        ],
        commonMistakes: [
            'Cong lưng khi kéo nặng',
            'Dùng lực tay nhiều hơn lưng',
            'Gập hông quá thấp gây áp lực lưng dưới'
        ],
        suggestedSets: '3-4 sets × 8-10 reps',
        restSeconds: 120,
        caloriesPer10Min: 75,
        variations: ['Landmine Row', 'Chest-Supported T-Bar', 'Wide Grip T-Bar']
    },


    // --- LEGS EXPANSION ---
    {
        id: 'leg-006',
        name: 'Chùn Chân (Lunges)',
        nameEn: 'Lunges',
        target: 'Gym/Chân',
        equipment: 'Tạ đơn/Bodyweight',
        difficulty: 'intermediate',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/t8iSghb.gif',
        primaryMuscle: 'Đùi Trước',
        secondaryMuscles: ['Mông', 'Đùi Sau'],
        instructions: [
            'Đứng thẳng, bước một chân về phía trước.',
            'Hạ trọng tâm cho đến khi hai gối gập 90 độ.',
            'Đạp mạnh chân trước để trở về tư thế đứng.',
            'Đổi chân và lặp lại.'
        ],
        tips: ['Giữ thân thẳng, không nghiêng về trước', 'Gối trước không vượt quá mũi chân', 'Bước đủ rộng để gối sau gần chạm sàn'],
        commonMistakes: ['Gối trước đẩy quá xa gây áp lực đầu gối', 'Thân người nghiêng về trước', 'Bước quá hẹp'],
        suggestedSets: '3 sets × 10-12 reps mỗi chân',
        restSeconds: 90,
        caloriesPer10Min: 70,
        variations: ['Walking Lunge', 'Reverse Lunge', 'Bulgarian Split Squat']
    },
    {
        id: 'leg-007',
        name: 'Nhón Bắp Chân Đứng (Standing Calf Raise)',
        nameEn: 'Standing Calf Raise',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/2ORFMoR.gif',
        primaryMuscle: 'Bắp Chân',
        instructions: [
            'Đứng trên máy hoặc bục, mũi chân đặt lên mép.',
            'Hạ gót chân xuống thấp nhất có thể.',
            'Nhón gót lên cao hết mức, siết cơ bắp chân.'
        ],
        tips: ['Hạ gót xuống hết biên độ để kéo giãn bắp chân', 'Giữ 1-2 giây ở đỉnh', 'Không dùng đà vung gót'],
        commonMistakes: ['Biên độ ngắn, không hạ gót đủ sâu', 'Dùng đà nhún', 'Gối cong khi nâng'],
        suggestedSets: '3-4 sets × 15-20 reps',
        restSeconds: 45,
        caloriesPer10Min: 40,
        variations: ['Seated Calf Raise', 'Single Leg Calf Raise', 'Donkey Calf Raise']
    },
    {
        id: 'leg-008',
        name: 'Cuốn Đùi Sau Nằm (Lying Leg Curl)',
        nameEn: 'Lying Leg Curl',
        target: 'Gym/Chân',
        equipment: 'Máy tập',
        difficulty: 'beginner',
        category: 'strength',
        gifUrl: 'https://static.exercisedb.dev/media/17lJ1kr.gif',
        primaryMuscle: 'Đùi Sau',
        instructions: [
            'Nằm sấp trên máy, cổ chân đặt dưới đệm.',
            'Gập chân cuốn đệm lên phía mông.',
            'Giữ 1 giây rồi hạ xuống chậm rãi.'
        ],
        tips: ['Siết đùi sau ở điểm cao nhất', 'Hạ xuống chậm 2-3 giây', 'Điều chỉnh đệm khớp với cổ chân'],
        commonMistakes: ['Nâng mông khỏi ghế khi cuốn', 'Dùng đà vung chân', 'Hạ tạ quá nhanh'],
        suggestedSets: '3 sets × 12-15 reps',
        restSeconds: 60,
        caloriesPer10Min: 50,
        variations: ['Seated Leg Curl', 'Standing Leg Curl', 'Nordic Curl']
    },




    // --- ARMS EXPANSION ---

    {
        id: 'arm-006',
        name: 'Duỗi Tay Sau Ghế (Bench Dip)',
        target: 'Gym/Tay',
        equipment: 'Ghế tập',
        difficulty: 'beginner',
        gifUrl: 'https://static.exercisedb.dev/media/LkoAWAE.gif',
        primaryMuscle: 'Tay Sau',
        instructions: [
            'Đặt tay lên mép ghế, chân duỗi thẳng hoặc gập gối.',
            'Hạ hông xuống sàn cho đến khi khuỷu tay gập 90 độ.',
            'Đẩy mạnh tay để nâng người lên.'
        ]
    },





    // --- KETTLEBELL ---
    {
        id: 'kb-001',
        name: 'Kettlebell Swing',
        target: 'Gym/FullBody',
        equipment: 'Kettlebell',
        difficulty: 'intermediate',
        gifUrl: 'https://static.exercisedb.dev/media/UHJlbu3.gif',
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
        gifUrl: 'https://static.exercisedb.dev/media/ZA8b5hc.gif',
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
        gifUrl: 'https://static.exercisedb.dev/media/Ha7SZ3y.gif',
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
        gifUrl: 'https://static.exercisedb.dev/media/82LxxkW.gif',
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
        gifUrl: 'https://static.exercisedb.dev/media/dG7tG5y.gif',
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
        gifUrl: 'https://static.exercisedb.dev/media/7WaDzyL.gif',
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
        gifUrl: 'https://static.exercisedb.dev/media/hBGWILP.gif',
        primaryMuscle: 'Đùi Trong',
        instructions: [
            'Ngồi vào máy, đặt chân lên đệm trong.',
            'Dùng lực đùi trong ép hai chân lại gần nhau.'
        ]
    },

    // --- CALISTHENICS ---

    {
        id: 'cali-002',
        name: 'Pistol Squat',
        target: 'Gym/Chân',
        equipment: 'Bodyweight',
        difficulty: 'advanced',
        gifUrl: 'https://static.exercisedb.dev/media/5bpPTHv.gif',
        primaryMuscle: 'Đùi Trước/Mông',
        instructions: [
            'Đứng một chân, chân kia duỗi thẳng ra trước.',
            'Squat xuống sâu nhất có thể bằng một chân.',
            'Giữ thăng bằng và đứng dậy.'
        ]
    },


    // --- COMPOUND VARIATIONS ---
    {
        id: 'var-001',
        name: 'Sumo Deadlift',
        target: 'Gym/Chân',
        equipment: 'Thanh đòn',
        difficulty: 'intermediate',
        gifUrl: 'https://static.exercisedb.dev/media/KgI0tqW.gif',
        primaryMuscle: 'Mông/Đùi Trong',
        secondaryMuscles: ['Lưng Dưới'],
        instructions: [
            'Chân đứng rộng hơn vai, mũi chân xoay ra ngoài.',
            'Tay nắm thanh đòn hẹp hơn chân.',
            'Giữ lưng thẳng, đạp sàn để nâng tạ.'
        ]
    },






    // --- DUMBBELL EXERCISES ---
    {
        id: 'db-001',
        name: 'Đẩy Ngực Trên Tạ Đơn (Incline DB Press)',
        target: 'Gym/Ngực',
        equipment: 'Tạ đơn',
        difficulty: 'intermediate',
        gifUrl: 'https://static.exercisedb.dev/media/PG1kcIb.gif',
        primaryMuscle: 'Ngực Trên',
        secondaryMuscles: ['Vai Trước', 'Tay Sau'],
        instructions: [
            'Điều chỉnh ghế dốc lên 30-45 độ.',
            'Cầm tạ đơn, đẩy thẳng lên trần nhà.',
            'Hạ xuống sâu để kéo giãn ngực trên.',
            'Thở ra khi đẩy, hít khi hạ.'
        ]
    },


];

export const CALCULATORS = [
    { id: '1rm', name: '1 Rep Max', desc: 'Sức mạnh tối đa' },
    { id: 'bmi', name: 'BMI / Body Fat', desc: 'Chỉ số cơ thể' },
    { id: 'water', name: 'Theo Dõi Nước', desc: 'Theo dõi nước' },
    { id: 'macro', name: 'TDEE & Macro', desc: 'Dinh dưỡng' },
    { id: 'plate', name: 'Tính Bánh Tạ', desc: 'Tính tạ' },
];
