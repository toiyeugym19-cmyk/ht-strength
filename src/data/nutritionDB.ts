export interface FoodItem {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    unit: string;
    category: 'protein' | 'carb' | 'fat' | 'veggie' | 'fruit' | 'drink' | 'dish';
}

export const FOOD_DB: FoodItem[] = [
    // --- Món Việt Phổ Biến ---
    { id: 'v-001', name: 'Phở Bò (Tô đặc biệt)', calories: 450, protein: 25, carbs: 65, fat: 12, unit: '1 tô', category: 'dish' },
    { id: 'v-002', name: 'Phở Gà', calories: 400, protein: 28, carbs: 60, fat: 8, unit: '1 tô', category: 'dish' },
    { id: 'v-003', name: 'Cơm Tấm Sườn Bì Chả', calories: 650, protein: 35, carbs: 85, fat: 22, unit: '1 dĩa', category: 'dish' },
    { id: 'v-004', name: 'Bánh Mì Thịt (Đầy đủ)', calories: 400, protein: 18, carbs: 55, fat: 14, unit: '1 ổ', category: 'dish' },
    { id: 'v-005', name: 'Bún Bò Huế', calories: 480, protein: 30, carbs: 60, fat: 16, unit: '1 tô', category: 'dish' },
    { id: 'v-006', name: 'Hủ Tiếu Nam Vang', calories: 420, protein: 22, carbs: 65, fat: 10, unit: '1 tô', category: 'dish' },
    { id: 'v-007', name: 'Gỏi Cuốn (Tôm thịt)', calories: 70, protein: 5, carbs: 10, fat: 1, unit: '1 cuốn', category: 'dish' },
    { id: 'v-008', name: 'Cơm Trắng', calories: 200, protein: 4, carbs: 44, fat: 0.5, unit: '1 chén (150g)', category: 'carb' },

    // --- Protein (Gym) ---
    { id: 'p-001', name: 'Ức Gà (Luộc/Nướng)', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g', category: 'protein' },
    { id: 'p-002', name: 'Thịt Bò Thăn (Nạc)', calories: 250, protein: 26, carbs: 0, fat: 15, unit: '100g', category: 'protein' },
    { id: 'p-003', name: 'Cá Hồi (Phi lê)', calories: 208, protein: 20, carbs: 0, fat: 13, unit: '100g', category: 'protein' },
    { id: 'p-004', name: 'Trứng Gà (Lớn)', calories: 72, protein: 6, carbs: 0.6, fat: 5, unit: '1 quả', category: 'protein' },
    { id: 'p-005', name: 'Lòng Trắng Trứng', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, unit: '1 quả', category: 'protein' },
    { id: 'p-006', name: 'Whey Protein (1 Scoop)', calories: 120, protein: 24, carbs: 3, fat: 1, unit: '1 muỗng', category: 'protein' },
    { id: 'p-007', name: 'Cá Ngừ (Đóng hộp)', calories: 100, protein: 22, carbs: 0, fat: 1, unit: '1 hộp', category: 'protein' },
    { id: 'p-008', name: 'Đậu Hũ (Trắng)', calories: 76, protein: 8, carbs: 2, fat: 4.8, unit: '100g', category: 'protein' },

    // --- Carbs ---
    { id: 'c-001', name: 'Khoai Lang (Luộc)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, unit: '100g', category: 'carb' },
    { id: 'c-002', name: 'Yến Mạch (Khô)', calories: 389, protein: 16.9, carbs: 66, fat: 6.9, unit: '100g', category: 'carb' },
    { id: 'c-003', name: 'Gạo Lứt (Nấu chín)', calories: 110, protein: 2.6, carbs: 23, fat: 0.9, unit: '100g', category: 'carb' },
    { id: 'c-004', name: 'Chuối', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, unit: '1 quả vừa', category: 'fruit' },
    { id: 'c-005', name: 'Táo', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, unit: '1 quả vừa', category: 'fruit' },

    // --- Fats ---
    { id: 'f-001', name: 'Bơ Đậu Phộng', calories: 188, protein: 8, carbs: 6, fat: 16, unit: '2 muỗng (32g)', category: 'fat' },
    { id: 'f-002', name: 'Hạnh Nhân', calories: 160, protein: 6, carbs: 6, fat: 14, unit: '28g (23 hạt)', category: 'fat' },
    { id: 'f-003', name: 'Dầu Ô Liu', calories: 119, protein: 0, carbs: 0, fat: 13.5, unit: '1 muỗng canh', category: 'fat' },
    { id: 'f-004', name: 'Trái Bơ (Avocado)', calories: 160, protein: 2, carbs: 9, fat: 15, unit: '100g', category: 'fat' },

    // --- Drinks ---
    { id: 'd-001', name: 'Sữa Tươi (Không đường)', calories: 62, protein: 3.2, carbs: 4.8, fat: 3.3, unit: '100ml', category: 'drink' },
    { id: 'd-002', name: 'Cà Phê Sữa Đá', calories: 150, protein: 2, carbs: 25, fat: 5, unit: '1 ly', category: 'drink' },
    { id: 'd-003', name: 'Trà Sữa (Bình thường)', calories: 350, protein: 0, carbs: 60, fat: 10, unit: '1 ly (M)', category: 'drink' },

    // --- Món Ngon Việt Nam (Vietnamese Specialties) ---
    { id: 'v-009', name: 'Bánh Xèo', calories: 350, protein: 10, carbs: 45, fat: 15, unit: '1 cái', category: 'dish' },
    { id: 'v-010', name: 'Bún Chả Hà Nội', calories: 550, protein: 25, carbs: 70, fat: 15, unit: '1 suất', category: 'dish' },
    { id: 'v-011', name: 'Bánh Cuốn (Chả lụa)', calories: 400, protein: 12, carbs: 55, fat: 10, unit: '1 dĩa', category: 'dish' },
    { id: 'v-012', name: 'Xôi Gà', calories: 500, protein: 20, carbs: 65, fat: 12, unit: '1 gói', category: 'dish' },
    { id: 'v-013', name: 'Bún Riêu Cua', calories: 450, protein: 18, carbs: 60, fat: 14, unit: '1 tô', category: 'dish' },
    { id: 'v-014', name: 'Mì Quảng', calories: 520, protein: 22, carbs: 68, fat: 16, unit: '1 tô', category: 'dish' },
    { id: 'v-015', name: 'Cơm Rang Dưa Bò', calories: 680, protein: 20, carbs: 90, fat: 25, unit: '1 dĩa', category: 'dish' },
    { id: 'v-016', name: 'Chả Giò (Nem Rán)', calories: 85, protein: 3, carbs: 8, fat: 5, unit: '1 cuốn', category: 'dish' },
    { id: 'v-017', name: 'Bánh Bèo', calories: 40, protein: 1, carbs: 8, fat: 0.5, unit: '1 chén nhỏ', category: 'dish' },
    { id: 'v-018', name: 'Bánh Chưng/Tét', calories: 350, protein: 12, carbs: 50, fat: 10, unit: '1 miếng (1/8)', category: 'dish' },
    { id: 'v-019', name: 'Canh Chua Cá Lóc', calories: 150, protein: 15, carbs: 10, fat: 4, unit: '1 tô nhỏ', category: 'dish' },
    { id: 'v-020', name: 'Thịt Kho Tàu (Kèm trứng)', calories: 300, protein: 20, carbs: 5, fat: 22, unit: '1 chén', category: 'dish' },

    // --- Fruits & Veggies (Trái cây & Rau củ) ---
    { id: 'fv-001', name: 'Thanh Long', calories: 60, protein: 1.2, carbs: 13, fat: 0, unit: '100g', category: 'fruit' },
    { id: 'fv-002', name: 'Xoài Chín', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, unit: '100g', category: 'fruit' },
    { id: 'fv-003', name: 'Sầu Riêng', calories: 147, protein: 1.5, carbs: 27, fat: 5.3, unit: '100g', category: 'fruit' },
    { id: 'fv-004', name: 'Chôm Chôm', calories: 82, protein: 0.7, carbs: 21, fat: 0.2, unit: '100g', category: 'fruit' },
    { id: 'fv-005', name: 'Măng Cụt', calories: 73, protein: 0.4, carbs: 18, fat: 0.6, unit: '100g', category: 'fruit' },
    { id: 'fv-006', name: 'Dưa Hấu', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, unit: '100g', category: 'fruit' },
    { id: 'fv-007', name: 'Cam', calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, unit: '1 quả', category: 'fruit' },
    { id: 'fv-008', name: 'Ổi', calories: 68, protein: 2.6, carbs: 14, fat: 1, unit: '100g', category: 'fruit' },
    { id: 'fv-009', name: 'Rau Muống Xào Tỏi', calories: 120, protein: 3, carbs: 4, fat: 10, unit: '1 dĩa', category: 'veggie' },
    { id: 'fv-010', name: 'Súp Lơ Xanh (Luộc)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, unit: '100g', category: 'veggie' },
    { id: 'fv-011', name: 'Dưa Leo', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, unit: '100g', category: 'veggie' },
    { id: 'fv-012', name: 'Cà Rốt', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, unit: '100g', category: 'veggie' },
    { id: 'fv-013', name: 'Cải Bó Xôi', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, unit: '100g', category: 'veggie' },

    // --- Snacks & Desserts (Ăn vặt) ---
    { id: 's-001', name: 'Bánh Tráng Trộn', calories: 300, protein: 6, carbs: 45, fat: 11, unit: '1 bịch', category: 'dish' },
    { id: 's-002', name: 'Chè Thái', calories: 400, protein: 4, carbs: 70, fat: 12, unit: '1 ly', category: 'dish' },
    { id: 's-003', name: 'Sữa Chua (Vinamilk)', calories: 100, protein: 3.5, carbs: 15, fat: 3, unit: '1 hộp', category: 'dish' },
    { id: 's-004', name: 'Bánh Flan', calories: 70, protein: 3, carbs: 10, fat: 3, unit: '1 cái', category: 'dish' },
    { id: 's-005', name: 'Trà Đào Cam Sả', calories: 120, protein: 0, carbs: 30, fat: 0, unit: '1 ly', category: 'drink' },
    { id: 's-006', name: 'Chocolate (Đen 70%)', calories: 170, protein: 2, carbs: 13, fat: 12, unit: '28g', category: 'fat' },
    { id: 's-007', name: 'Hạt Điều (Rang muối)', calories: 160, protein: 5, carbs: 9, fat: 13, unit: '30g', category: 'fat' },

    // --- Ingredients & Condiments (Nguyên liệu & Gia vị) ---
    { id: 'i-001', name: 'Nước Mắm', calories: 10, protein: 2, carbs: 0.5, fat: 0, unit: '1 muỗng canh', category: 'dish' },
    { id: 'i-002', name: 'Dầu Ăn (Đậu nành)', calories: 120, protein: 0, carbs: 0, fat: 14, unit: '1 muỗng canh', category: 'fat' },
    { id: 'i-003', name: 'Đường Trắng', calories: 50, protein: 0, carbs: 13, fat: 0, unit: '1 muỗng canh', category: 'carb' },
    { id: 'i-004', name: 'Mật Ong', calories: 64, protein: 0, carbs: 17, fat: 0, unit: '1 muỗng canh', category: 'carb' },
    { id: 'i-005', name: 'Bột Mì', calories: 364, protein: 10, carbs: 76, fat: 1, unit: '100g', category: 'carb' },
    { id: 'i-006', name: 'Nước Tương (Xì dầu)', calories: 10, protein: 2, carbs: 1, fat: 0, unit: '1 muỗng canh', category: 'dish' },

    // --- Drinks (Đồ uống) ---
    { id: 'd-004', name: 'Nước Ngọt (Coke/Pepsi)', calories: 140, protein: 0, carbs: 39, fat: 0, unit: '1 lon (330ml)', category: 'drink' },
    { id: 'd-005', name: 'Nước Ngọt Diet (Zero Calo)', calories: 0, protein: 0, carbs: 0, fat: 0, unit: '1 lon', category: 'drink' },
    { id: 'd-006', name: 'Bia (Lager)', calories: 150, protein: 1, carbs: 13, fat: 0, unit: '1 lon (330ml)', category: 'drink' },
    { id: 'd-007', name: 'Rượu Vang Đỏ', calories: 125, protein: 0, carbs: 4, fat: 0, unit: '1 ly (150ml)', category: 'drink' },
    { id: 'd-008', name: 'Nước Dừa Tươi', calories: 45, protein: 0.5, carbs: 9, fat: 0.5, unit: '1 quả/ly', category: 'drink' },
    { id: 'd-009', name: 'Sinh Tố Bơ (Ít sữa)', calories: 350, protein: 4, carbs: 30, fat: 25, unit: '1 ly', category: 'drink' },
    { id: 'd-010', name: 'Trà Xanh (Không đường)', calories: 2, protein: 0, carbs: 0, fat: 0, unit: '1 ly', category: 'drink' },
    { id: 'd-011', name: 'Nước Cam Vắt (Không đường)', calories: 110, protein: 2, carbs: 26, fat: 0.5, unit: '1 ly', category: 'drink' },

    // --- Fast Food (Thức ăn nhanh) ---
    { id: 'ff-001', name: 'Pizza (Pepperoni)', calories: 300, protein: 12, carbs: 28, fat: 14, unit: '1 miếng', category: 'dish' },
    { id: 'ff-002', name: 'Hamburger Bò', calories: 550, protein: 25, carbs: 45, fat: 30, unit: '1 cái', category: 'dish' },
    { id: 'ff-003', name: 'Khoai Tây Chiên', calories: 365, protein: 4, carbs: 48, fat: 17, unit: '1 phần vừa', category: 'carb' },
    { id: 'ff-004', name: 'Gà Rán (Đùi)', calories: 250, protein: 18, carbs: 10, fat: 16, unit: '1 cái', category: 'protein' },
    { id: 'ff-005', name: 'Mì Ý Sốt Bò Bằm', calories: 600, protein: 22, carbs: 75, fat: 20, unit: '1 dĩa', category: 'dish' },
    { id: 'ff-006', name: 'Bánh Mì Kebab', calories: 500, protein: 20, carbs: 55, fat: 25, unit: '1 cái', category: 'dish' },

    // --- Vietnamese Snacks (Ăn vặt Việt Nam thêm) ---
    { id: 'vs-001', name: 'Bánh Tráng Nướng', calories: 350, protein: 10, carbs: 40, fat: 18, unit: '1 cái', category: 'dish' },
    { id: 'vs-002', name: 'Hột Vịt Lộn', calories: 180, protein: 14, carbs: 4, fat: 12, unit: '1 quả', category: 'protein' },
    { id: 'vs-003', name: 'Bột Chiên (Kèm trứng)', calories: 600, protein: 15, carbs: 70, fat: 30, unit: '1 dĩa', category: 'dish' },
    { id: 'vs-004', name: 'Gỏi Khô Bò', calories: 250, protein: 15, carbs: 30, fat: 8, unit: '1 dĩa', category: 'dish' },
    { id: 'vs-005', name: 'Bắp Xào Tép Hành', calories: 300, protein: 5, carbs: 45, fat: 12, unit: '1 hộp', category: 'dish' },
    { id: 'vs-006', name: 'Cá Viên Chiên', calories: 150, protein: 8, carbs: 18, fat: 6, unit: '1 xiên', category: 'protein' },
    { id: 'vs-007', name: 'Chè Đậu Đen', calories: 350, protein: 8, carbs: 65, fat: 5, unit: '1 ly', category: 'carb' },
    { id: 'vs-008', name: 'Tào Phớ (Nước đường)', calories: 150, protein: 6, carbs: 28, fat: 2, unit: '1 chén', category: 'dish' },

    // --- Healthy Alternatives (Thay thế lành mạnh) ---
    { id: 'h-001', name: 'Bánh Mì Nguyên Cám', calories: 80, protein: 4, carbs: 15, fat: 1, unit: '1 lát', category: 'carb' },
    { id: 'h-002', name: 'Bơ Đậu Phộng Tự Nhiên (Không đường)', calories: 190, protein: 8, carbs: 6, fat: 16, unit: '2 muỗng', category: 'fat' },
    { id: 'h-003', name: 'Sữa Hạnh Nhân (Không đường)', calories: 30, protein: 1, carbs: 1, fat: 2.5, unit: '1 ly (240ml)', category: 'drink' },
    { id: 'h-004', name: 'Sữa Chua Hy Lạp', calories: 100, protein: 17, carbs: 6, fat: 0, unit: '1 hộp (150g)', category: 'protein' },
    { id: 'h-005', name: 'Hạt Chia', calories: 138, protein: 4.7, carbs: 12, fat: 8.7, unit: '28g', category: 'fat' }
];
