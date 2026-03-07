import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CalendarEvent {
    id: string;
    title: string;
    type: 'appointment' | 'focus' | 'social' | 'health';
    startTime: string; // ISO
    endTime: string;   // ISO
    description?: string;
    location?: string;
}

interface CalendarState {
    events: CalendarEvent[];
    addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
    deleteEvent: (id: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
    persist(
        (set) => ({
            events: [
                {
                    id: 'sample-1',
                    title: 'Check-in sức khỏe định kỳ',
                    type: 'health',
                    startTime: new Date(new Date().setHours(14, 0)).toISOString(),
                    endTime: new Date(new Date().setHours(15, 0)).toISOString(),
                    description: 'Kiểm tra InBody và tư vấn nutrition.'
                },
                {
                    id: 'sample-2',
                    title: 'Supper App Feedback Session',
                    type: 'appointment',
                    startTime: new Date(new Date().setHours(10, 0)).toISOString(),
                    endTime: new Date(new Date().setHours(11, 0)).toISOString(),
                }
            ],
            addEvent: (event) => set((state) => ({
                events: [...state.events, { ...event, id: crypto.randomUUID() }]
            })),
            updateEvent: (id, updates) => set((state) => ({
                events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
            })),
            deleteEvent: (id) => set((state) => ({
                events: state.events.filter(e => e.id !== id)
            })),
        }),
        { name: 'superapp-calendar-storage' }
    )
);
