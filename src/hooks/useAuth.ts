import { useState, useEffect } from 'react';

// Mock User Interface
interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập check login từ localStorage
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string) => {
        // Giả lập login thành công
        const mockUser = {
            uid: 'user-123',
            email: email,
            displayName: 'Admin User',
            photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        };
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return mockUser;
    };

    const logout = async () => {
        localStorage.removeItem('mock_user');
        setUser(null);
    };

    return { user, loading, login, logout };
}
