import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function PrivateRoute() {
    // const { user, loading } = useAuth(); // useAuth giờ đã là Mock

    // TEMPORARY BYPASS FOR DEVELOPMENT
    return <Outlet />;

    // if (loading) {
    //     return (
    //         <div className="h-screen w-full bg-[#030014] flex flex-col items-center justify-center text-white gap-4">
    //             <Loader2 className="animate-spin text-blue-500" size={40} />
    //             <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest animate-pulse">Checking Access...</p>
    //         </div>
    //     );
    // }

    // if (!user) {
    //     return <Navigate to="/login" replace />;
    // }

    // return <Outlet />;
}
