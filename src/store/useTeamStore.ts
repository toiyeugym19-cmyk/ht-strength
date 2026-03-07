import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TeamMember {
    id: string;
    name: string;
    avatar: string;
    role: 'admin' | 'pt' | 'manager' | 'staff';
    status: 'online' | 'offline' | 'busy';
}

interface TeamState {
    members: TeamMember[];
    addMember: (member: TeamMember) => void;
    updateMemberStatus: (id: string, status: TeamMember['status']) => void;
}

export const useTeamStore = create<TeamState>()(
    persist(
        (set) => ({
            members: [
                { id: 'admin-1', name: 'Admin Minh', role: 'admin', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Minh+Admin&background=0A84FF&color=fff' },
                { id: 'pt-1', name: 'PT Hùng', role: 'pt', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Hung+PT&background=30D158&color=fff' },
                { id: 'pt-2', name: 'PT Lan', role: 'pt', status: 'busy', avatar: 'https://ui-avatars.com/api/?name=Lan+PT&background=FF9F0A&color=fff' },
                { id: 'manager-1', name: 'Manager Tuấn', role: 'manager', status: 'offline', avatar: 'https://ui-avatars.com/api/?name=Tuan+Manager&background=BF5AF2&color=fff' },
            ],
            addMember: (member) => set((state) => ({ members: [...state.members, member] })),
            updateMemberStatus: (id, status) => set((state) => ({
                members: state.members.map(m => m.id === id ? { ...m, status } : m)
            })),
        }),
        { name: 'superapp-team-storage' }
    )
);
