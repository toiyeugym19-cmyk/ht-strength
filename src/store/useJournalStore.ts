import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type JournalEntry = {
    id: string;
    date: string; // ISO Date
    content: string; // HTML/JSON from Tiptap
    mood?: 'happy' | 'neutral' | 'stressed' | 'energetic';
};

type JournalState = {
    entries: JournalEntry[];
    addEntry: (entry: Omit<JournalEntry, 'id'>) => void;
    updateEntry: (id: string, content: string) => void;
    getEntryByDate: (date: string) => JournalEntry | undefined;
    deleteEntry: (id: string) => void;
};

export const useJournalStore = create<JournalState>()(
    persist(
        (set, get) => ({
            entries: [],
            addEntry: (entry) => set((state) => ({
                entries: [{ ...entry, id: crypto.randomUUID() }, ...state.entries] // newest first
            })),
            updateEntry: (id, content) => set((state) => ({
                entries: state.entries.map(e => e.id === id ? { ...e, content } : e)
            })),
            deleteEntry: (id) => set((state) => ({
                entries: state.entries.filter(e => e.id !== id)
            })),
            getEntryByDate: (dateStr) => {
                return get().entries.find(e => e.date.startsWith(dateStr));
            }
        }),
        {
            name: 'lifeos-journal-storage',
        }
    )
);
