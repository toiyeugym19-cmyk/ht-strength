import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'hts-theme';

export function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'dark';
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
        if (stored === 'light' || stored === 'dark') return stored;
        return 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const setLight = () => setThemeState('light');
    const setDark = () => setThemeState('dark');
    const toggleTheme = () => setThemeState(prev => prev === 'light' ? 'dark' : 'light');

    return { theme, setLight, setDark, toggleTheme };
}
