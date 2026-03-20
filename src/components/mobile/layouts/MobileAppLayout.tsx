// Mobile App Layout - Main wrapper with navigation
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Toaster } from 'sonner';

import type { Screen } from '../ui';
import { MemberAutomationEngine } from '../../MemberAutomationEngine';

// Import all screens
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { OSDashboard } from '../screens/OSDashboard';
import { MembersScreen, MemberDetailScreen } from '../screens/MembersScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { BioScreen } from '../screens/BioScreen';
import { NeuralScreen } from '../screens/NeuralScreen';
import { PlaceholderScreen } from '../ui';
import { MobileTabBar } from '../navigation/MobileTabBar';

export function MobileAppLayout() {
    const [screen, setScreen] = useState<Screen>('onboarding');
    const [data, setData] = useState<any>(null);

    const nav = (s: Screen, d?: any) => {
        if (d) setData(d);
        setScreen(s);
    };


    return (
        <div className="max-w-[430px] mx-auto h-screen bg-black text-white relative flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] border-x border-white/5 overflow-hidden">
            <Toaster position="top-center" theme="dark" richColors />
            <MemberAutomationEngine />

            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* Main Screens */}
                    {screen === 'onboarding' && (
                        <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <OnboardingScreen nav={nav} />
                        </motion.div>
                    )}
                    {screen === 'os' && (
                        <motion.div key="os" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <OSDashboard nav={nav} />
                        </motion.div>
                    )}
                    {screen === 'members' && (
                        <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <MembersScreen nav={nav} />
                        </motion.div>
                    )}
                    {screen === 'member_detail' && (
                        <motion.div key="member_detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <MemberDetailScreen member={data} nav={nav} />
                        </motion.div>
                    )}
                    {screen === 'chat' && (
                        <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <ChatScreen nav={nav} />
                        </motion.div>
                    )}
                    {screen === 'bio' && (
                        <motion.div key="bio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <BioScreen nav={nav} />
                        </motion.div>
                    )}
                    {screen === 'neural' && (
                        <motion.div key="neural" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <NeuralScreen nav={nav} />
                        </motion.div>
                    )}

                    {/* OS Sub-screens */}
                    {['os_analytics', 'os_calendar', 'os_notifications', 'os_reports', 'os_settings'].includes(screen) && (
                        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <PlaceholderScreen title={screen.replace('os_', '').toUpperCase()} nav={nav} backTo="os" />
                        </motion.div>
                    )}

                    {/* Members Sub-screens */}
                    {['members_add', 'members_groups', 'members_expired', 'members_stats'].includes(screen) && (
                        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <PlaceholderScreen title={screen.replace('members_', '').toUpperCase()} nav={nav} backTo="members" />
                        </motion.div>
                    )}

                    {/* Chat Sub-screens */}
                    {['chat_broadcast', 'chat_templates', 'chat_history', 'chat_bots'].includes(screen) && (
                        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <PlaceholderScreen title={screen.replace('chat_', '').toUpperCase()} nav={nav} backTo="chat" />
                        </motion.div>
                    )}

                    {/* Bio Sub-screens */}
                    {['bio_health', 'bio_goals', 'bio_achievements', 'bio_schedule', 'bio_settings'].includes(screen) && (
                        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <PlaceholderScreen title={screen.replace('bio_', '').toUpperCase()} nav={nav} backTo="bio" />
                        </motion.div>
                    )}

                    {/* Neural Sub-screens */}
                    {['neural_workflows', 'neural_logs', 'neural_blueprints', 'neural_integrations', 'neural_diagnostics'].includes(screen) && (
                        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <PlaceholderScreen title={screen.replace('neural_', '').toUpperCase()} nav={nav} backTo="neural" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            {screen !== 'onboarding' && (
                <MobileTabBar currentScreen={screen} onNavigate={nav} />
            )}
        </div>
    );
}
