import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircleNotch } from '@phosphor-icons/react';

export default function PrivateRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4" style={{ background: 'var(--g-bg, #0C0C0E)' }}>
                <CircleNotch className="animate-spin" size={36} weight="bold" style={{ color: 'var(--g-accent, #E8613A)' }} />
                <p className="text-sm font-semibold uppercase tracking-widest animate-pulse" style={{ color: 'var(--g-text-3, #4E4E58)' }}>
                    Loading...
                </p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
