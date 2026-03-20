export const MOCK_NUTRITION = {
    macros: {
        protein: { current: 120, target: 180, unit: 'g' },
        carbs: { current: 150, target: 250, unit: 'g' },
        fats: { current: 45, target: 70, unit: 'g' },
        calories: { current: 1650, target: 2400 }
    },
    meals: [
        { id: 1, type: 'Breakfast', name: 'Oatmeal & Whey', cals: 450, time: '08:00 AM', img: 'https://images.unsplash.com/photo-1517607648415-b4b1800a3e59?w=400&q=80' },
        { id: 2, type: 'Lunch', name: 'Chicken Breast & Rice', cals: 650, time: '12:30 PM', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80' },
        { id: 3, type: 'Snack', name: 'Greek Yogurt', cals: 200, time: '04:00 PM', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80' }
    ]
};

export const MOCK_PROFILE = {
    name: 'Son Piaz',
    level: 'Elite',
    stats: {
        workouts: 142,
        hours: 186,
        volume: '1.2M', // kg
        streak: 15 // days
    },
    badges: [
        { id: 1, name: 'Early Bird', icon: '🌅', desc: '5 workouts 6AM' },
        { id: 2, name: 'Heavy Lifter', icon: '🦍', desc: 'Squat 150kg' },
        { id: 3, name: 'Streak 10', icon: '🔥', desc: '10 days in a row' }
    ]
};
