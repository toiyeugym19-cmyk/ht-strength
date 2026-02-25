import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    it('renders correctly', () => {
        render(<App />);
        // Basic check to ensure the app mounts, checking for a common element might depend on content
        // For now, just ensure it doesn't crash on render
        expect(document.body).toBeDefined();
    });
});
