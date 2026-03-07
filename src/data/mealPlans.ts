export interface Meal {
    time: string;
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface MealPlanTemplate {
    id: string;
    name: string;
    description: string;
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    meals: Meal[];
}

export const MEAL_PLANS: MealPlanTemplate[] = [
    {
        id: 'weight_loss_1500',
        name: 'Giảm Mỡ Cấp Tốc (1500 kcal)',
        description: 'Tập trung vào thực phẩm nguyên bản, giàu protein và chất xơ để giữ cơ bắp khi thâm hụt calo.',
        totalCalories: 1530,
        protein: 135,
        carbs: 120,
        fat: 45,
        meals: [
            { time: '07:30', name: 'Bữa Sáng', description: '2 quả trứng luộc + 1 lát bánh mì đen + 1/2 quả bơ', calories: 350, protein: 18, carbs: 25, fat: 20 },
            { time: '10:00', name: 'Bữa Phụ Sáng', description: '1 quả táo + 10 hạt hạnh nhân', calories: 150, protein: 3, carbs: 20, fat: 8 },
            { time: '12:30', name: 'Bữa Trưa', description: '150g ức gà áp chảo + 100g khoai lang luộc + súp lơ xanh', calories: 450, protein: 45, carbs: 35, fat: 12 },
            { time: '16:00', name: 'Bữa Phụ Chiều', description: '1 muỗng whey protein + 1 quả chuối', calories: 230, protein: 25, carbs: 30, fat: 2 },
            { time: '19:00', name: 'Bữa Tối', description: '150g cá hồi nướng + salad rau củ hỗn hợp', calories: 350, protein: 44, carbs: 10, fat: 15 }
        ]
    },
    {
        id: 'muscle_gain_2500',
        name: 'Tăng Cơ Toàn Diện (2500 kcal)',
        description: 'Giàu tinh bột phức hợp và protein cao để cung cấp năng lượng cho các buổi tập nặng.',
        totalCalories: 2550,
        protein: 180,
        carbs: 300,
        fat: 70,
        meals: [
            { time: '08:00', name: 'Bữa Sáng', description: 'Oatmeal: 80g yến mạch + 1 muỗng whey + hạt chia + quả mọng', calories: 550, protein: 35, carbs: 65, fat: 15 },
            { time: '11:00', name: 'Bữa Phụ Sáng', description: '2 quả trứng ốp la + 1 lát bánh mì nguyên cám', calories: 320, protein: 16, carbs: 20, fat: 18 },
            { time: '13:00', name: 'Bữa Trưa', description: '200g thịt bò nạc + 2 bát cơm trắng + rau xanh', calories: 750, protein: 55, carbs: 90, fat: 15 },
            { time: '16:30', name: 'Bữa Phụ Chiều (Pre-workout)', description: 'Sữa chua Hy Lạp + mật ong + các loại hạt', calories: 380, protein: 25, carbs: 45, fat: 10 },
            { time: '20:00', name: 'Bữa Tối', description: '200g lườn gà + 1 bát cơm + măng tây xào tỏi', calories: 550, protein: 50, carbs: 80, fat: 12 }
        ]
    },
    {
        id: 'lean_maintenance_2000',
        name: 'Duy trì & Săn chắc (2000 kcal)',
        description: 'Cân bằng giữa các nhóm chất, phù hợp cho người muốn duy trì vóc dáng và sức bền.',
        totalCalories: 2050,
        protein: 150,
        carbs: 210,
        fat: 65,
        meals: [
            { time: '07:30', name: 'Bữa Sáng', description: 'Bún chả cá (nhiều rau) + 1 ly sữa đậu nành không đường', calories: 450, protein: 25, carbs: 55, fat: 12 },
            { time: '12:00', name: 'Bữa Trưa', description: '1 bát cơm + 150g tôm rim + đậu que luộc', calories: 550, protein: 40, carbs: 70, fat: 10 },
            { time: '15:30', name: 'Bữa Phụ', description: '1 quả cam + 1 hũ sữa chua ít đường', calories: 150, protein: 8, carbs: 25, fat: 3 },
            { time: '19:00', name: 'Bữa Tối', description: 'Phở bò (nước trong, bỏ váng mỡ, nhiều hành)', calories: 520, protein: 35, carbs: 60, fat: 15 },
            { time: '21:30', name: 'Bữa Khuya (Optional)', description: '1 ly casein hoặc sữa ấm (nếu đói)', calories: 180, protein: 22, carbs: 10, fat: 5 }
        ]
    }
];
