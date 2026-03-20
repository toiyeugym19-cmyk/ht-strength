import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useAutomationStore, type PendingSuggestion } from '../store/useAutomationStore';
import { useStore } from '../hooks/useStore';
import { useMemberStore } from '../store/useMemberStore';
import { parseISO, differenceInDays } from 'date-fns';

/**
 * AUTOMATION ENGINE HOOK
 * 
 * Hook này đóng vai trò là "bộ não" tự động của ứng dụng.
 * Nó chạy các điều kiện kích hoạt (triggers) và tạo ra các gợi ý/hành động.
 */

export interface AutomationEngineResult {
    isEngineRunning: boolean;
    enabledPlansCount: number;
    totalPlansCount: number;
    totalTriggersToday: number;
    lastEngineRun: string | null;
    pendingSuggestions: PendingSuggestion[];
    dismissSuggestion: (suggestionId: string) => void;
    runEngine: () => void;
}

export function useAutomationEngine(): AutomationEngineResult {
    const {
        plans,
        logs,
        pendingSuggestions,
        isEngineRunning,
        lastEngineRun,
        addLog,
        addSuggestion,
        dismissSuggestion: storeDismissSuggestion,
        clearExpiredSuggestions,
        setEngineStatus,
        updateLastRun
    } = useAutomationStore();

    const { gymLogs } = useStore();
    const { members } = useMemberStore();

    // Use a ref to prevent double-firing on strict mode re-renders
    const processingRef = useRef(false);

    // Derived values
    const enabledPlansCount = useMemo(() => plans.filter(p => p.enabled).length, [plans]);
    const totalPlansCount = useMemo(() => plans.length, [plans]);

    // Calculate total triggers today from logs
    const totalTriggersToday = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return logs.filter(log => new Date(log.timestamp) >= today).length;
    }, [logs]);

    // Run automation engine
    const runEngine = useCallback(() => {
        if (processingRef.current) return;
        processingRef.current = true;
        setEngineStatus(true);

        try {
            // Clear expired suggestions first
            clearExpiredSuggestions();

            const now = new Date();
            const currentHour = now.getHours();
            const enabledPlans = plans.filter(p => p.enabled);
            const activeMember = members.find(m => m.status === 'Active') || members[0];

            // Check each enabled plan
            enabledPlans.forEach(plan => {
                let shouldTrigger = false;
                let payloadOverride = null;

                // --- LOGIC TRIGGER THÔNG MINH ---
                switch (plan.id) {
                    // 1. Morning Coffee (6-8h sáng)
                    case 'energy_001':
                        if (currentHour >= 6 && currentHour <= 8) shouldTrigger = true;
                        break;

                    // 2. Sleep Optimization (Sau 22h)
                    case 'nutrition_004':
                        if (currentHour >= 22) shouldTrigger = true;
                        break;

                    // 3. Discipline Check (Bỏ tập > 3 ngày)
                    case 'mindset_001':
                        if (activeMember && activeMember.lastCheckIn) {
                            const lastDate = activeMember.lastCheckIn === 'N/A'
                                ? parseISO(activeMember.joinDate)
                                : parseISO(activeMember.lastCheckIn);

                            const daysOff = differenceInDays(now, lastDate);
                            if (daysOff >= 3) {
                                shouldTrigger = true;
                                payloadOverride = {
                                    ...plan.actionPayload,
                                    message: `Bạn đã nghỉ ${daysOff} ngày rồi. Quay lại ngay trước khi mất cơ bắp! 💪`
                                };
                            }
                        }
                        break;

                    // 4. Birthday Delight (Sinh nhật)
                    // (Giả lập map vào một plan có sẵn hoặc tạo suggestion trực tiếp)
                    case 'mindset_004': // Milestone Celebration -> Dùng tạm cho Birthday
                        if (activeMember && activeMember.dateOfBirth) {
                            try {
                                const dob = parseISO(activeMember.dateOfBirth);
                                if (dob.getDate() === now.getDate() && dob.getMonth() === now.getMonth()) {
                                    shouldTrigger = true;
                                    payloadOverride = {
                                        title: `🎉 Happy Birthday, ${activeMember.name}!`,
                                        message: 'Quà sinh nhật từ Gym: Voucher giảm giá 20% gia hạn gói tập!',
                                        icon: 'gift',
                                        priority: 'high'
                                    };
                                }
                            } catch (e) { /* ignore date parse error */ }
                        }
                        break;

                    // 5. Pre-workout Meal (Giả lập giờ tập là 17h)
                    case 'nutrition_003':
                        if (currentHour === 15) shouldTrigger = true; // 2 tiếng trước 17h
                        break;

                    default:
                        // Fallback logic cho các plan khác (random 5% chance trigger for demo purpose)
                        if (Math.random() < 0.05) shouldTrigger = true;
                        break;
                }

                // --- ACTION EXECUTION ---
                if (shouldTrigger && plan.actionPayload) {
                    const finalPayload = payloadOverride || plan.actionPayload;

                    // Check duplicate suggestion (tránh spam cùng 1 loại)
                    const alreadyExists = pendingSuggestions.some(s => s.planId === plan.id);

                    if (!alreadyExists) {
                        addSuggestion({
                            planId: plan.id,
                            title: finalPayload.title || plan.nameVi,
                            message: finalPayload.message || plan.description,
                            icon: finalPayload.icon || 'zap',
                            priority: finalPayload.priority || 'medium',
                            dismissable: true
                        });

                        addLog({
                            planId: plan.id,
                            planName: plan.nameVi,
                            timestamp: new Date().toISOString(),
                            message: `Đã kích hoạt: ${finalPayload.title}`,
                            type: 'info'
                        });
                    }
                }
            });

            // --- SYSTEM ALERTS (Non-Plan) ---

            // Check each member for alerts
            members.forEach(m => {
                // 1. Membership Expiry Date (Existing)
                if (m.expiryDate) {
                    const expiry = parseISO(m.expiryDate);
                    const daysLeft = differenceInDays(expiry, now);

                    if (daysLeft <= 3 && daysLeft >= 0) {
                        const expiryId = `sys_expiry_${m.id}`;
                        if (!pendingSuggestions.some(s => s.planId === expiryId)) {
                            addSuggestion({
                                planId: expiryId,
                                title: `⚠️ Sắp hết hạn gói: ${m.name}`,
                                message: `Gói tập của ${m.name} sẽ hết hạn trong ${daysLeft} ngày nữa. Gia hạn ngay!`,
                                icon: 'alert-triangle',
                                priority: 'high',
                                dismissable: true
                            });
                        }
                    }
                }

                // 2. Low Sessions (MINDMAP B6)
                const remaining = (m.sessionsTotal || 0) - (m.sessionsUsed || 0);
                if (remaining <= 3 && remaining > 0 && m.status === 'Active') {
                    const lowSessionId = `sys_low_sessions_${m.id}`;
                    if (!pendingSuggestions.some(s => s.planId === lowSessionId)) {
                        addSuggestion({
                            planId: lowSessionId,
                            title: `🔔 Sắp hết buổi: ${m.name}`,
                            message: `${m.name} chỉ còn ${remaining} buổi tập. Hãy chủ động liên hệ tư vấn gia hạn!`,
                            icon: 'clock',
                            priority: 'medium',
                            dismissable: true
                        });
                    }
                }

                // 3. Milestone Achievement (MINDMAP E2)
                if (m.sessionsUsed > 0 && m.sessionsUsed % 10 === 0) {
                    const milestoneId = `sys_milestone_${m.id}_${m.sessionsUsed}`;
                    if (!pendingSuggestions.some(s => s.planId === milestoneId)) {
                        addSuggestion({
                            planId: milestoneId,
                            title: `🎉 Cột mốc mới: ${m.name}`,
                            message: `Hội viên ${m.name} đã hoàn thành ${m.sessionsUsed} buổi tập! Đừng quên tặng một lời khen hoặc phần quà nhỏ.`,
                            icon: 'award',
                            priority: 'medium',
                            dismissable: true
                        });
                    }
                }
            });

            // --- AUTO-OPTIMIZATION: MONOTONY CHECK ---
            // Detect if user is doing same exercise too often (last 3 logs are same)
            const recentGymLogs = gymLogs.slice(-3);
            if (recentGymLogs.length === 3) {
                const uniqueExercises = new Set(recentGymLogs.map((l: any) => l.exerciseName));
                if (uniqueExercises.size === 1) {
                    const exerciseName = (recentGymLogs[0] as any).exerciseName;
                    // Check if last log is recent (within 2 days) to be relevant
                    const lastLogDate = new Date((recentGymLogs[2] as any).date);
                    if (differenceInDays(now, lastLogDate) <= 2) {
                        // Only warn if not already suggested
                        if (!pendingSuggestions.some(s => s.title === '🛑 Cảnh báo Lặp Bài')) {
                            addSuggestion({
                                planId: 'system',
                                title: '🛑 Cảnh báo Lặp Bài',
                                message: `Bạn đã tập "${exerciseName}" 3 lần liên tiếp. Cơ bắp cần kích thích mới để phát triển! Hãy thử bài biến thể khác.`,
                                icon: 'repeat',
                                priority: 'medium',
                                dismissable: true
                            });
                        }
                    }
                }
            }

            updateLastRun();
        } catch (error) {
            console.error('Automation Engine Error:', error);
            addLog({
                planId: 'system',
                planName: 'System Core',
                timestamp: new Date().toISOString(),
                message: `Runtime Error: ${error}`,
                type: 'warning'
            });
        } finally {
            setEngineStatus(false);
            processingRef.current = false;
        }
    }, [
        plans,
        gymLogs,
        members,
        pendingSuggestions,
        setEngineStatus,
        clearExpiredSuggestions,
        addSuggestion,
        addLog,
        updateLastRun
    ]);

    const savedRunEngine = useRef(runEngine);
    useEffect(() => {
        savedRunEngine.current = runEngine;
    }, [runEngine]);

    // Run engine periodically
    useEffect(() => {
        // Initial run
        const timer = setTimeout(() => {
            savedRunEngine.current();
        }, 1500);

        // Periodic run
        const interval = setInterval(() => {
            savedRunEngine.current();
        }, 60 * 1000); // Check every minute

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    return {
        isEngineRunning,
        enabledPlansCount,
        totalPlansCount,
        totalTriggersToday,
        lastEngineRun,
        pendingSuggestions,
        dismissSuggestion: storeDismissSuggestion,
        runEngine
    };
}

/**
 * AUTOMATION ENGINE COMPONENT (Invisible)
 * 
 * Component này có thể được mount trong Layout để chạy engine ngầm.
 * Hiện tại hook đã tự chạy nên component này chỉ là wrapper.
 */
export function AutomationEngine() {
    // Just run the hook to activate the automation engine
    useAutomationEngine();

    // This component is invisible
    return null;
}

export default AutomationEngine;
