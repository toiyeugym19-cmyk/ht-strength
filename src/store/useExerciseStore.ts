import { create } from 'zustand';
import { MEGA_EXERCISE_DB, type UniversalExercise, type MuscleGroup, type ExerciseType } from '../data/mega_database';

interface ExerciseState {
    exercises: UniversalExercise[];
    filteredExercises: UniversalExercise[];
    searchQuery: string;
    selectedMuscle: MuscleGroup | 'all';
    selectedType: ExerciseType | 'all';

    // Actions
    setSearchQuery: (query: string) => void;
    setMuscleFilter: (muscle: MuscleGroup | 'all') => void;
    setTypeFilter: (type: ExerciseType | 'all') => void;
    resetFilters: () => void;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
    exercises: MEGA_EXERCISE_DB,
    filteredExercises: MEGA_EXERCISE_DB,
    searchQuery: '',
    selectedMuscle: 'all',
    selectedType: 'all',

    setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().resetFilters(); // Re-trigger filter logic (simplified for now, ideally separate applyFilter function)
        // Apply logic
        const { exercises, selectedMuscle, selectedType } = get();
        const lowerQuery = query.toLowerCase();

        const filtered = exercises.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(lowerQuery) || ex.muscle.includes(lowerQuery);
            const matchesMuscle = selectedMuscle === 'all' || ex.muscle === selectedMuscle;
            const matchesType = selectedType === 'all' || ex.type === selectedType;
            return matchesSearch && matchesMuscle && matchesType;
        });
        set({ filteredExercises: filtered });
    },

    setMuscleFilter: (muscle) => {
        set({ selectedMuscle: muscle });
        // Re-apply filters
        const { exercises, searchQuery, selectedType } = get();
        const lowerQuery = searchQuery.toLowerCase();

        const filtered = exercises.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(lowerQuery) || ex.muscle.includes(lowerQuery);
            const matchesMuscle = muscle === 'all' || ex.muscle === muscle;
            const matchesType = selectedType === 'all' || ex.type === selectedType;
            return matchesSearch && matchesMuscle && matchesType;
        });
        set({ filteredExercises: filtered });
    },

    setTypeFilter: (type) => {
        set({ selectedType: type });
        // Re-apply filters
        const { exercises, searchQuery, selectedMuscle } = get();
        const lowerQuery = searchQuery.toLowerCase();

        const filtered = exercises.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(lowerQuery) || ex.muscle.includes(lowerQuery);
            const matchesMuscle = selectedMuscle === 'all' || ex.muscle === selectedMuscle;
            const matchesType = type === 'all' || ex.type === type;
            return matchesSearch && matchesMuscle && matchesType;
        });
        set({ filteredExercises: filtered });
    },

    resetFilters: () => {
        // Internal helper, usually just sets back to default if needed, 
        // but here we just re-run filtering logic in the setters.
    }
}));
