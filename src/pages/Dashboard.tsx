import { useAuth } from '../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import MemberDashboard from './MemberDashboard';

// ============================================================
//  DASHBOARD — Role-based: Admin/PT vs Member
// ============================================================
export default function Dashboard() {
    const { user } = useAuth();
    if (user?.role === 'admin' || user?.role === 'pt') return <AdminDashboard />;
    return <MemberDashboard />;
}
