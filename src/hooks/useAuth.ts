import { create } from 'zustand';

// Mock User Interface
export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: 'admin' | 'pt' | 'member';
    ptName?: string;   // Khi role=pt: tên PT để filter HV
    memberId?: string; // Khi role=member: id member để lấy dữ liệu cá nhân
}

interface AuthState {
    user: User | null;
    loading: boolean;
    login: (email: string) => Promise<User>;
    logout: () => Promise<void>;
}

// Initial check
const storedUser = localStorage.getItem('mock_user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

export const useAuth = create<AuthState>((set) => ({
    user: initialUser,
    loading: false,
    login: async (email: string) => {
        // Mock role based on email parsing
        let role: 'admin' | 'pt' | 'member' = 'member';
        let displayName = 'Member User';

        let ptName: string | undefined;
        let memberId: string | undefined;
        if (email.includes('admin')) {
            role = 'admin';
            displayName = 'Admin Hùng Phan';
        } else if (email.includes('pt')) {
            role = 'pt';
            displayName = 'PT User';
            ptName = 'Coach Thor';
        } else {
            displayName = 'Nguyễn Văn A'; // Member mặc định
            memberId = 'm1'; // Link với member đầu tiên
        }

        const mockUser: User = {
            uid: `user-${Date.now()}`,
            email: email,
            displayName: displayName,
            photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
            role: role,
            ptName,
            memberId
        };
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        set({ user: mockUser });
        return mockUser;
    },
    logout: async () => {
        localStorage.removeItem('mock_user');
        set({ user: null });
        window.location.href = '/login';
    }
}));
