import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
    beforeEach(() => {
        localStorage.removeItem('mock_user');
    });

    it('login with admin email sets admin role', async () => {
        const { result } = renderHook(() => useAuth());
        await act(async () => {
            await result.current.login('admin@test.com');
        });
        expect(result.current.user?.role).toBe('admin');
        expect(result.current.user?.ptName).toBeUndefined();
    });

    it('login with pt email sets pt role and ptName', async () => {
        const { result } = renderHook(() => useAuth());
        await act(async () => {
            await result.current.login('pt@test.com');
        });
        expect(result.current.user?.role).toBe('pt');
        expect(result.current.user?.ptName).toBe('Coach Thor');
    });

    it('login with member email sets member role and memberId', async () => {
        const { result } = renderHook(() => useAuth());
        await act(async () => {
            await result.current.login('member@test.com');
        });
        expect(result.current.user?.role).toBe('member');
        expect(result.current.user?.memberId).toBe('m1');
    });
});
