import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Member {
    id: string;
    name: string;
    phone: string;
    email?: string;
    avatar?: string;
    status: 'Active' | 'Expired' | 'Pending' | 'Banned';
    membershipType: string; // '1 Month', '3 Months', '6 Months', '1 Year', 'PT Sessions'
    startDate: string;
    expiryDate: string;
    joinDate: string;

    // Session tracking for PT/Class packs
    sessionsTotal: number;
    sessionsUsed: number;

    checkInHistory: Array<{
        date: string;
        type: string; // 'Gym Access', 'PT Session', 'Class'
    }>;

    lastCheckIn: string | null;
    notes?: string;

    // Physical Stats (Optional tracking)
    height?: number;
    weight?: number;
    goals?: string[];
}

interface MemberState {
    members: Member[];

    // Actions
    addMember: (member: Omit<Member, 'id' | 'joinDate' | 'checkInHistory' | 'sessionsUsed'>) => void;
    updateMember: (id: string, updates: Partial<Member>) => void;
    deleteMember: (id: string) => void;
    performCheckIn: (id: string, type?: string) => void;
    refreshMemberStatus: () => void; // Auto check expiry
}

export const useMemberStore = create<MemberState>()(
    persist(
        (set, get) => ({
            members: [
                {
                    id: 'm1',
                    name: 'Nguyễn Văn A',
                    phone: '0901234567',
                    status: 'Active',
                    membershipType: 'Gói 1 Năm',
                    startDate: '2024-01-01',
                    expiryDate: '2025-01-01',
                    joinDate: '2024-01-01',
                    sessionsTotal: 365,
                    sessionsUsed: 42,
                    checkInHistory: [],
                    lastCheckIn: '2024-02-02T08:30:00',
                    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random',
                },
                {
                    id: 'm2',
                    name: 'Trần Thị B',
                    phone: '0912345678',
                    status: 'Active',
                    membershipType: 'Gói 3 Tháng',
                    startDate: '2024-02-01',
                    expiryDate: '2024-05-01',
                    joinDate: '2024-02-01',
                    sessionsTotal: 90,
                    sessionsUsed: 5,
                    checkInHistory: [],
                    lastCheckIn: '2024-02-03T17:00:00',
                    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=random',
                },
                {
                    id: 'm3',
                    name: 'Lê Văn C',
                    phone: '0987654321',
                    status: 'Expired',
                    membershipType: 'Gói 1 Tháng',
                    startDate: '2023-12-01',
                    expiryDate: '2024-01-01',
                    joinDate: '2023-12-01',
                    sessionsTotal: 30,
                    sessionsUsed: 28,
                    checkInHistory: [],
                    lastCheckIn: '2023-12-30T09:00:00',
                    avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=random',
                }
            ],

            addMember: (memberData) => set((state) => ({
                members: [
                    {
                        ...memberData,
                        id: crypto.randomUUID(),
                        joinDate: new Date().toISOString(),
                        checkInHistory: [],
                        sessionsUsed: 0,
                        lastCheckIn: null
                    },
                    ...state.members
                ]
            })),

            updateMember: (id, updates) => set((state) => ({
                members: state.members.map(m => m.id === id ? { ...m, ...updates } : m)
            })),

            deleteMember: (id) => set((state) => ({
                members: state.members.filter(m => m.id !== id)
            })),

            performCheckIn: (id, type = 'Gym Access') => set((state) => ({
                members: state.members.map(m => {
                    if (m.id !== id) return m;

                    const now = new Date().toISOString();
                    return {
                        ...m,
                        sessionsUsed: m.sessionsUsed + 1,
                        lastCheckIn: now,
                        checkInHistory: [
                            { date: now, type },
                            ...m.checkInHistory
                        ]
                    };
                })
            })),

            refreshMemberStatus: () => set((state) => {
                const now = new Date();
                return {
                    members: state.members.map(m => {
                        const expiry = new Date(m.expiryDate);
                        if (m.status !== 'Banned' && expiry < now) {
                            return { ...m, status: 'Expired' };
                        }
                        return m;
                    })
                };
            })
        }),
        {
            name: 'lifeos-member-store',
        }
    )
);
