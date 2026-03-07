import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MemberExercisesPage from './pages/MemberExercisesPage';
import MemberProgressPage from './pages/MemberProgressPage';
import MemberStatsPage from './pages/MemberStatsPage';
import MemberWorkoutPage from './pages/MemberWorkoutPage';
import MyPlanPage from './pages/MyPlanPage';
import GymPage from './pages/GymPage';
import EcosystemPage from './pages/EcosystemPage';
import WorkPage from './pages/WorkPage';
import CalendarPage from './pages/CalendarPage';
import JournalPage from './pages/JournalPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NutritionPage from './pages/NutritionPage';
import SettingsPage from './pages/SettingsPage';
import KnowledgePage from './pages/KnowledgePage';
import ReviewHubPage from './pages/ReviewHubPage';
import MembersPage from './pages/MembersPage';
import PTsPage from './pages/PTsPage';
import CalorieTrackerPage from './pages/CalorieTrackerPage';
import StepCounterPage from './pages/StepCounterPage';
import MeditationPage from './pages/MeditationPage';
import ProgressPage from './pages/ProgressPage';
import SocialPage from './pages/SocialPage';
import ProfilePage from './pages/ProfilePage';


import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';

// Guard: chỉ admin/PT mới vào được, member → về trang chủ
function AdminOnlyRoute() {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user?.role === 'admin' || user?.role === 'pt') return <Outlet />;
    return <Navigate to="/" replace />;
}

function App() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--g-bg)' }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Layout />}>

                            {/* ── Routes tất cả roles đều thấy ── */}
                            <Route index element={<Dashboard />} />
                            <Route path="exercises" element={<MemberExercisesPage />} />
                            <Route path="my-workout" element={<MemberWorkoutPage />} />
                            <Route path="my-plan" element={<MyPlanPage />} />
                            <Route path="my-progress" element={<MemberProgressPage />} />
                            <Route path="knowledge" element={<KnowledgePage />} />
                            <Route path="my-stats" element={<MemberStatsPage />} />
                            <Route path="calories" element={<CalorieTrackerPage />} />
                            <Route path="steps" element={<StepCounterPage />} />
                            <Route path="meditation" element={<MeditationPage />} />
                            <Route path="profile" element={<ProfilePage />} />

                            <Route path="settings" element={<SettingsPage />} />
                            {/* Superapp: Công việc + Lịch cho mọi role */}

                            <Route path="calendar" element={<CalendarPage />} />

                            {/* ── Routes chỉ Admin / PT ── */}
                            <Route element={<AdminOnlyRoute />}>
                                <Route path="members" element={<MembersPage />} />
                                <Route path="pt" element={<PTsPage />} />
                                <Route path="gym" element={<GymPage />} />
                                <Route path="analytics" element={<AnalyticsPage />} />
                                <Route path="ecosystem" element={<EcosystemPage />} />
                                <Route path="journal" element={<JournalPage />} />
                                <Route path="nutrition" element={<NutritionPage />} />
                                <Route path="work" element={<WorkPage />} />
                                <Route path="review-hub" element={<ReviewHubPage />} />
                                <Route path="progress" element={<ProgressPage />} />
                                <Route path="social" element={<SocialPage />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
