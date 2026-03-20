import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock scrollTo for jsdom (Layout uses scrollRef.current?.scrollTo)
Element.prototype.scrollTo = vi.fn();
