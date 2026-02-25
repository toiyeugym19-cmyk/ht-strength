import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as KonstaApp } from 'konsta/react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
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

import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';

function App() {
    return (
        <KonstaApp theme="ios" safeAreas dark>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="gym" element={<GymPage />} />
                            <Route path="ecosystem" element={<EcosystemPage />} />

                            <Route path="nutrition" element={<NutritionPage />} />
                            <Route path="members" element={<MembersPage />} />
                            <Route path="work" element={<WorkPage />} />
                            <Route path="calendar" element={<CalendarPage />} />
                            <Route path="journal" element={<JournalPage />} />
                            <Route path="analytics" element={<AnalyticsPage />} />
                            <Route path="knowledge" element={<KnowledgePage />} />
                            <Route path="review-hub" element={<ReviewHubPage />} />

                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </KonstaApp>
    );
}

export default App;
