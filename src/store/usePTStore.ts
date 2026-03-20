import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PTS_2 } from '../data/mockGymData';

export interface PT {
    id: string;
    name: string;
    phone: string;
    email?: string;
    avatar?: string;
    status: 'Active' | 'Inactive' | 'OnLeave';
    specialty: string[];
    joinDate: string;
    memberCount: number;
    rating?: number;
    notes?: string;
}

interface PTState {
    pts: PT[];

    addPT: (pt: Omit<PT, 'id' | 'joinDate' | 'memberCount'>) => void;
    updatePT: (id: string, updates: Partial<PT>) => void;
    deletePT: (id: string) => void;
    setMemberCount: (id: string, count: number) => void;
}

export const usePTStore = create<PTState>()(
    persist(
        (set) => ({
            pts: PTS_2,

            addPT: (ptData) => set((state) => ({
                pts: [
                    {
                        ...ptData,
                        id: crypto.randomUUID(),
                        joinDate: new Date().toISOString().split('T')[0],
                        memberCount: 0,
                    },
                    ...state.pts,
                ],
            })),

            updatePT: (id, updates) => set((state) => ({
                pts: state.pts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
            })),

            deletePT: (id) => set((state) => ({
                pts: state.pts.filter((p) => p.id !== id),
            })),

            setMemberCount: (id, count) => set((state) => ({
                pts: state.pts.map((p) => (p.id === id ? { ...p, memberCount: count } : p)),
            })),
        }),
        { name: 'lifeos-pt-store-v2' }
    )
);
