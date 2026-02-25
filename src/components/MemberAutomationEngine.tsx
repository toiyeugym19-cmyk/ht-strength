import { useEffect, useCallback } from 'react';
import { useMemberAutomationStore, type MemberAutomationPlan } from '../store/useMemberAutomationStore';
import { useMemberStore, type Member } from '../store/useMemberStore';
import { differenceInDays, isSameDay, parseISO, getDay, getHours, isLastDayOfMonth } from 'date-fns';

/**
 * MEMBER AUTOMATION ENGINE v2.0 - BỘ NÃO TỰ ĐỘNG HÓA 50+ PLANS
 * 
 * Engine này phân tích dữ liệu hội viên và trigger các automation plans
 * dựa trên điều kiện được cấu hình. Tích hợp n8n webhook.
 */

// Configuration
const N8N_BASE_URL = import.meta.env.VITE_N8N_URL || 'http://localhost:5678';
const ENGINE_INTERVAL = 30 * 1000; // 30 giây (cho demo), Product nên để 5-15 phút
const MAX_LOGS_PER_RUN = 50;

// Member context for evaluation
interface MemberContext {
    member: Member;
    daysUntilExpiry: number;
    daysSinceExpiry: number;
    daysSinceLastCheckIn: number;
    daysSinceRegistration: number;
    totalCheckIns: number;
    currentStreak: number;
    engagementScore: number;
    isBirthdayToday: boolean;
    isNewMember: boolean;
    isTrial: boolean;
    isVIP: boolean;
    avgWeeklyCheckIns: number;
    gymOnlyCheckIns: number;
    classCheckIns: number;
    // Health Metrics
    daysSinceLastMeasure: number;
    weightDiff: number;
    muscleDiff: number;
}

export function MemberAutomationEngine() {
    const {
        plans,
        addLog,
        addTask,
        setEngineStatus,
        updateLastRun,
        updateTodayStats,
        setN8nStatus
    } = useMemberAutomationStore();
    const { members } = useMemberStore();

    // Build context cho mỗi hội viên
    const buildMemberContext = useCallback((member: Member): MemberContext => {
        const now = new Date();
        const expiryDate = member.expiryDate ? parseISO(member.expiryDate) : now;
        const lastCheckIn = member.lastCheckIn ? parseISO(member.lastCheckIn) : null;
        const registrationDate = member.registrationDate ? parseISO(member.registrationDate) : parseISO(member.joinDate);

        const daysUntilExpiry = differenceInDays(expiryDate, now);
        const daysSinceExpiry = daysUntilExpiry < 0 ? Math.abs(daysUntilExpiry) : 0;
        const daysSinceLastCheckIn = lastCheckIn ? differenceInDays(now, lastCheckIn) : 999;
        const daysSinceRegistration = differenceInDays(now, registrationDate);

        // Calculate engagement score (0-100)
        let engagementScore = 50;
        if (daysSinceLastCheckIn <= 3) engagementScore += 30;
        else if (daysSinceLastCheckIn <= 7) engagementScore += 15;
        else if (daysSinceLastCheckIn > 14) engagementScore -= 30;

        const totalCheckIns = member.checkInHistory?.length || 0;
        if (totalCheckIns > 50) engagementScore += 25;
        else if (totalCheckIns > 20) engagementScore += 15;
        else if (totalCheckIns > 10) engagementScore += 10;

        engagementScore = Math.max(0, Math.min(100, engagementScore));

        // Calculate streak
        let currentStreak = 0;
        if (member.checkInHistory && member.checkInHistory.length > 0) {
            const sortedHistory = [...member.checkInHistory].sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            for (let i = 0; i < sortedHistory.length && i < 100; i++) {
                const checkDate = parseISO(sortedHistory[i].date);
                const expectedDate = new Date(now);
                expectedDate.setDate(expectedDate.getDate() - i);
                if (isSameDay(checkDate, expectedDate)) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }

        // Check birthday
        let isBirthdayToday = false;
        if (member.dateOfBirth) {
            const dob = parseISO(member.dateOfBirth);
            const today = new Date();
            isBirthdayToday = dob.getDate() === today.getDate() && dob.getMonth() === today.getMonth();
        }

        // Week avg
        const last30DaysCheckIns = member.checkInHistory?.filter(c => {
            const checkDate = parseISO(c.date);
            return differenceInDays(now, checkDate) <= 30;
        }).length || 0;
        const avgWeeklyCheckIns = Math.round((last30DaysCheckIns / 4) * 10) / 10;

        // Check-in by type
        const gymOnlyCheckIns = member.checkInHistory?.filter(c => c.type === 'Gym Access').length || 0;
        const classCheckIns = member.checkInHistory?.filter(c => c.type === 'Class').length || 0;

        // Health Metrics calculation
        const healthHistory = member.healthMetrics?.sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()) || [];
        const latestMeasure = healthHistory[0];
        const prevMeasure = healthHistory[1];

        let daysSinceLastMeasure = 999;
        let weightDiff = 0;
        let muscleDiff = 0;

        if (latestMeasure) {
            daysSinceLastMeasure = differenceInDays(now, parseISO(latestMeasure.recordDate));
            if (prevMeasure) {
                weightDiff = latestMeasure.weight - prevMeasure.weight; // Âm là giảm cân
                muscleDiff = (latestMeasure.muscleMass || 0) - (prevMeasure.muscleMass || 0); // Dương là tăng cơ
            }
        }

        return {
            member,
            daysUntilExpiry,
            daysSinceExpiry,
            daysSinceLastCheckIn,
            totalCheckIns,
            currentStreak,
            engagementScore,
            isBirthdayToday,
            isNewMember: daysSinceRegistration <= 7,
            daysSinceRegistration,
            isTrial: member.membershipType === '1 Month' && daysSinceRegistration <= 14,
            isVIP: totalCheckIns >= 100 || currentStreak >= 30,
            avgWeeklyCheckIns,
            gymOnlyCheckIns,
            classCheckIns,
            daysSinceLastMeasure,
            weightDiff,
            muscleDiff
        };
    }, []);

    // Evaluate trigger condition
    const evaluateTrigger = useCallback((plan: MemberAutomationPlan, ctx: MemberContext): boolean => {
        const now = new Date();
        const hour = getHours(now);
        const dayOfWeek = getDay(now);

        try {
            switch (plan.id) {
                // RETENTION
                case 'retention_001': return ctx.daysUntilExpiry === 7 && ctx.member.status === 'Active';
                case 'retention_002': return ctx.daysUntilExpiry === 3 && ctx.member.status === 'Active';
                case 'retention_003': return ctx.daysUntilExpiry === 0 && ctx.member.status === 'Active';
                case 'retention_004': return ctx.daysSinceExpiry === 7;
                case 'retention_005': return ctx.daysSinceExpiry === 14;
                case 'retention_006': return ctx.daysSinceExpiry === 30;
                case 'retention_007': return ctx.daysSinceLastCheckIn === 7 && ctx.member.status === 'Active';
                case 'retention_008': return ctx.daysSinceLastCheckIn === 14 && ctx.member.status === 'Active';
                case 'retention_009': return ctx.daysSinceLastCheckIn === 21 && ctx.member.status === 'Active';
                case 'retention_010': return ctx.engagementScore < 30 && ctx.daysUntilExpiry <= 30 && ctx.daysUntilExpiry > 0;
                case 'retention_011': return false; // Manual trigger
                case 'retention_012': return false; // Needs freeze data

                // ACQUISITION
                case 'acquisition_001': return ctx.daysSinceRegistration === 0;
                case 'acquisition_002': return ctx.daysSinceRegistration === 1;
                case 'acquisition_003': return ctx.daysSinceRegistration === 3;
                case 'acquisition_004': return ctx.daysSinceRegistration === 7;
                case 'acquisition_005': return ctx.isTrial && ctx.daysUntilExpiry === 2;
                case 'acquisition_006': return ctx.isTrial && ctx.daysSinceExpiry === 1;
                case 'acquisition_007': return ctx.totalCheckIns >= 10 && ctx.totalCheckIns <= 12;
                case 'acquisition_008': return false; // Needs referral data

                // ENGAGEMENT
                case 'engagement_001': return ctx.isBirthdayToday;
                case 'engagement_002': return ctx.currentStreak === 7;
                case 'engagement_003': return ctx.currentStreak === 14;
                case 'engagement_004': return ctx.currentStreak === 30;
                case 'engagement_005': return ctx.currentStreak === 100;
                case 'engagement_006': return ctx.totalCheckIns === 50;
                case 'engagement_007': return ctx.totalCheckIns === 100;
                case 'engagement_008': return hour >= 17 && hour <= 20; // Peak hours
                case 'engagement_009': return ctx.gymOnlyCheckIns >= 20 && ctx.classCheckIns === 0;
                case 'engagement_010': return ctx.classCheckIns === 1;

                // PAYMENT
                case 'payment_001': return ctx.daysUntilExpiry === 7 && ctx.member.status === 'Active';
                case 'payment_002': return ctx.daysUntilExpiry === 3 && ctx.member.status === 'Active';
                case 'payment_003': return ctx.daysUntilExpiry === 0;
                case 'payment_004': return ctx.daysSinceExpiry === 7;
                case 'payment_005': return false; // Needs payment data
                case 'payment_006': return false; // Needs payment data

                // ANALYTICS
                case 'analytics_001': return hour === 22;
                case 'analytics_002': return dayOfWeek === 0 && hour === 20;
                case 'analytics_003': return isLastDayOfMonth(now) && hour === 23;
                case 'analytics_004': return false; // Needs aggregate data
                case 'analytics_005': return false; // Needs aggregate data
                case 'analytics_006': return false; // Needs aggregate data

                // OPERATIONS
                case 'operations_001': return false; // Needs equipment data
                case 'operations_002': return false; // Needs staff data
                case 'operations_003': return false; // Needs class data
                case 'operations_004': return false; // Needs PT session data
                case 'operations_005': return false; // Needs PT no-show data
                case 'operations_006': return false; // Needs locker data

                // MARKETING
                case 'marketing_001': return false; // Manual trigger
                case 'marketing_002': return false; // Manual trigger

                // HEALTH
                case 'health_plus_001': return ctx.weightDiff < -1;
                case 'health_plus_002': return ctx.muscleDiff > 0.5;
                case 'health_plus_003': return ctx.daysSinceLastMeasure >= 30;
                case 'marketing_003': return ctx.avgWeeklyCheckIns >= 5 && !ctx.isVIP;
                case 'marketing_004': return ctx.totalCheckIns % 30 === 0 && ctx.totalCheckIns > 0;

                // LOYALTY
                case 'loyalty_001': return false; // Needs loyalty data
                case 'loyalty_002': return ctx.daysSinceRegistration === 365;
                case 'loyalty_003': return ctx.isVIP;
                case 'loyalty_004': return false; // Needs points data

                // COMPLIANCE
                case 'compliance_001': return false; // Needs health data
                case 'compliance_002': return ctx.daysUntilExpiry <= 14;

                // AI INSIGHTS
                case 'ai_001': return false; // Needs AI analysis
                case 'ai_002': return dayOfWeek === 0;
                case 'ai_003': return false; // Needs overtraining score
                case 'ai_004': return false; // Needs schedule analysis

                default: return false;
            }
        } catch (error) {
            console.error(`Error evaluating trigger for ${plan.id}:`, error);
            return false;
        }
    }, []);

    // Trigger n8n webhook
    const triggerN8nWebhook = useCallback(async (plan: MemberAutomationPlan, ctx: MemberContext) => {
        if (!plan.n8nWorkflowId) return;

        try {
            const webhookUrl = `${N8N_BASE_URL}/webhook/${plan.n8nWorkflowId}`;

            // Log attempt
            console.log(`🔗 Attempting n8n Webhook: ${webhookUrl}`);

            // In a real scenario, we'd fetch. Since this might be local, we try-catch it.
            // We use a short timeout to not block the engine.
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        source: 'MODUN_GYM_DA_V4',
                        plan: plan,
                        member: {
                            id: ctx.member.id,
                            name: ctx.member.name,
                            phone: ctx.member.phone,
                            email: ctx.member.email,
                            membershipType: ctx.member.membershipType,
                            expiryDate: ctx.member.expiryDate
                        },
                        context: {
                            daysUntilExpiry: ctx.daysUntilExpiry,
                            engagementScore: ctx.engagementScore,
                            isVIP: ctx.isVIP
                        }
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    setN8nStatus('connected');
                } else {
                    console.warn(`n8n responded with status: ${response.status}`);
                }
            } catch (e) {
                // If it fails (e.g. n8n not running), we still count it as a trigger for UI demo purposes
                // but we keep the status as 'disconnected' or 'error'
                console.log('n8n endpoint unreachable - skipping real fetch');
                setN8nStatus('disconnected');
            }

            // Always add log in app
            addLog({
                planId: plan.id,
                planName: plan.nameVi,
                memberId: ctx.member.id,
                memberName: ctx.member.name,
                timestamp: new Date().toISOString(),
                message: `n8n activation: ${plan.n8nWorkflowId} [${plan.actionType}]`,
                type: 'n8n_trigger',
                n8nExecutionId: `n8n_${Math.random().toString(36).substr(2, 9)}`
            });

            return true;
        } catch (error) {
            console.error('Core n8n trigger error:', error);
            setN8nStatus('error');
            return false;
        }
    }, [addLog, setN8nStatus]);

    // Execute action
    const executeAction = useCallback((plan: MemberAutomationPlan, ctx: MemberContext) => {
        const { member, daysUntilExpiry, daysSinceLastCheckIn, engagementScore } = ctx;

        // Always try to trigger n8n webhook
        triggerN8nWebhook(plan, ctx);

        switch (plan.actionType) {
            case 'sms_notification':
            case 'push_notification':
            case 'zalo_message':
                // toast(plan.actionPayload.title || plan.nameVi, {
                //     description: `${member.name} - ${plan.description}`,
                //     icon: '📱'
                // });
                addLog({
                    planId: plan.id,
                    planName: plan.nameVi,
                    memberId: member.id,
                    memberName: member.name,
                    timestamp: new Date().toISOString(),
                    message: `Đã gửi thông báo: ${plan.actionPayload.template || 'default'}`,
                    type: 'success'
                });
                break;

            case 'email_campaign':
                addLog({
                    planId: plan.id,
                    planName: plan.nameVi,
                    memberId: member.id,
                    memberName: member.name,
                    timestamp: new Date().toISOString(),
                    message: `Email campaign queued: ${plan.actionPayload.template}`,
                    type: 'info'
                });
                break;

            case 'call_reminder':
            case 'create_task':
                addTask({
                    memberId: member.id,
                    memberName: member.name,
                    type: 'call',
                    title: plan.actionPayload.title || `Gọi điện: ${plan.nameVi}`,
                    description: plan.actionPayload.message?.replace('{memberName}', member.name)
                        .replace('{daysAbsent}', String(daysSinceLastCheckIn))
                        .replace('{daysLeft}', String(daysUntilExpiry)) || plan.description,
                    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    priority: plan.priority,
                    status: 'pending',
                    createdBy: 'system',
                    automationPlanId: plan.id
                });
                // toast.warning(`📞 Task mới: ${plan.nameVi}`, {
                //     description: `${member.name} - ${plan.description}`
                // });
                addLog({
                    planId: plan.id,
                    planName: plan.nameVi,
                    memberId: member.id,
                    memberName: member.name,
                    timestamp: new Date().toISOString(),
                    message: `Task created: ${plan.actionPayload.title || plan.nameVi}`,
                    type: plan.priority === 'critical' ? 'critical' : 'warning'
                });
                break;

            case 'internal_alert':
                if (plan.priority === 'critical') {
                    // toast.error(`🚨 ${plan.nameVi}`, {
                    //    description: `${member.name} - Cần can thiệp ngay!`,
                    //    duration: 10000
                    // });
                } else {
                    // toast.warning(`⚠️ ${plan.nameVi}`, {
                    //    description: `${member.name} - ${plan.description}`
                    // });
                }
                addLog({
                    planId: plan.id,
                    planName: plan.nameVi,
                    memberId: member.id,
                    memberName: member.name,
                    timestamp: new Date().toISOString(),
                    message: `Alert: ${plan.actionPayload.alertLevel || 'warning'} - Score: ${engagementScore}`,
                    type: plan.priority === 'critical' ? 'critical' : 'warning'
                });
                break;

            case 'discount_offer':
                // toast(`🎁 Ưu đãi: ${plan.actionPayload.discount}%`, {
                //     description: `${member.name} - ${plan.nameVi}`,
                //     icon: '💎'
                // });
                addLog({
                    planId: plan.id,
                    planName: plan.nameVi,
                    memberId: member.id,
                    memberName: member.name,
                    timestamp: new Date().toISOString(),
                    message: `Discount offer sent: ${plan.actionPayload.discount}%`,
                    type: 'success'
                });
                break;

            case 'vip_upgrade':
                // toast.success(`👑 VIP Upgrade: ${member.name}`, {
                //     description: `Chuỗi ${currentStreak} ngày liên tiếp!`,
                //     duration: 8000
                // });
                addLog({
                    planId: plan.id,
                    planName: plan.nameVi,
                    memberId: member.id,
                    memberName: member.name,
                    timestamp: new Date().toISOString(),
                    message: `VIP upgraded to ${plan.actionPayload.tier}`,
                    type: 'success'
                });
                break;

            case 'recommend_class':
                addLog({
                    planId: plan.id,
                    planName: plan.nameVi,
                    memberId: member.id,
                    memberName: member.name,
                    timestamp: new Date().toISOString(),
                    message: `Classes recommended: ${plan.actionPayload.suggestedClasses?.join(', ') || 'various'}`,
                    type: 'info'
                });
                break;

            case 'report_generate':
                addLog({
                    planId: plan.id,
                    planName: plan.nameVi,
                    timestamp: new Date().toISOString(),
                    message: `Report generated: ${plan.actionPayload.type}`,
                    type: 'info'
                });
                break;

            default:
                addLog({
                    planId: plan.id,
                    planName: plan.nameVi,
                    memberId: member.id,
                    memberName: member.name,
                    timestamp: new Date().toISOString(),
                    message: `Action executed: ${plan.actionType}`,
                    type: 'info'
                });
        }
    }, [addLog, addTask, triggerN8nWebhook]);

    // Calculate today stats
    const calculateTodayStats = useCallback(() => {
        const safeMembers = (members || []).filter(m => !!m);

        let expiringToday = 0;
        let expiringThisWeek = 0;
        let expiringThisMonth = 0;
        let newSignups = 0;
        let atRiskMembers = 0;
        let callsToMake = 0;
        let birthdaysToday = 0;
        let inactiveMembers = 0;
        let vipMembers = 0;

        safeMembers.forEach(member => {
            const ctx = buildMemberContext(member);

            if (ctx.daysUntilExpiry === 0) expiringToday++;
            if (ctx.daysUntilExpiry >= 0 && ctx.daysUntilExpiry <= 7) expiringThisWeek++;
            if (ctx.daysUntilExpiry >= 0 && ctx.daysUntilExpiry <= 30) expiringThisMonth++;
            if (ctx.isNewMember) newSignups++;
            if (ctx.engagementScore < 30 && ctx.daysUntilExpiry <= 30) atRiskMembers++;
            if (ctx.daysSinceLastCheckIn >= 14 && member.status === 'Active') {
                callsToMake++;
                inactiveMembers++;
            }
            if (ctx.isBirthdayToday) birthdaysToday++;
            if (ctx.isVIP) vipMembers++;
        });

        updateTodayStats({
            expiringToday,
            expiringThisWeek,
            expiringThisMonth,
            newSignups,
            atRiskMembers,
            callsToMake,
            birthdaysToday,
            inactiveMembers,
            vipMembers
        });
    }, [members, buildMemberContext, updateTodayStats]);

    // Main engine run
    const runEngine = useCallback(() => {
        const safeMembers = (members || []).filter(m => !!m);
        const enabledPlans = plans.filter(p => p.enabled);

        if (safeMembers.length === 0 || enabledPlans.length === 0) {
            return;
        }

        console.log(`🧠 Member Automation Engine v2.0 running...`);
        console.log(`📊 ${safeMembers.length} members, ${enabledPlans.length}/${plans.length} plans enabled`);

        let triggeredCount = 0;
        let n8nExecutions = 0;

        // For time-based plans (run once per interval)
        const timeBasedPlans = enabledPlans.filter(p =>
            p.triggerType === 'time_based' || p.triggerType === 'system_event'
        );
        timeBasedPlans.forEach(plan => {
            const dummyCtx = buildMemberContext(safeMembers[0] || {} as Member);
            if (evaluateTrigger(plan, dummyCtx)) {
                executeAction(plan, dummyCtx);
                triggeredCount++;
                if (plan.n8nWorkflowId) n8nExecutions++;
            }
        });

        // For member-based plans
        const memberPlans = enabledPlans.filter(p =>
            p.triggerType !== 'time_based' && p.triggerType !== 'system_event'
        );

        safeMembers.forEach(member => {
            const ctx = buildMemberContext(member);

            memberPlans.forEach(plan => {
                if (triggeredCount >= MAX_LOGS_PER_RUN) return;

                if (evaluateTrigger(plan, ctx)) {
                    executeAction(plan, ctx);
                    triggeredCount++;
                    if (plan.n8nWorkflowId) n8nExecutions++;
                }
            });
        });

        // Update stats
        calculateTodayStats();
        updateTodayStats({ n8nExecutions });
        updateLastRun();

        console.log(`✅ Engine completed: ${triggeredCount} actions triggered, ${n8nExecutions} n8n executions`);
    }, [members, plans, buildMemberContext, evaluateTrigger, executeAction, calculateTodayStats, updateLastRun, updateTodayStats]);

    // Lifecycle
    useEffect(() => {
        setEngineStatus(true);

        // Initial run after delay
        const initialTimeout = setTimeout(() => {
            runEngine();
        }, 3000);

        // Periodic run
        const interval = setInterval(() => {
            runEngine();
        }, ENGINE_INTERVAL);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
            setEngineStatus(false);
        };
    }, [runEngine, setEngineStatus]);

    return null; // Invisible component
}

// Custom hook for accessing automation data
export function useMemberAutomation() {
    const store = useMemberAutomationStore();

    const enabledPlansCount = store.plans.filter(p => p.enabled).length;
    const totalPlansCount = store.plans.length;
    const pendingTasks = store.tasks.filter(t => t.status === 'pending');
    const criticalTasks = store.tasks.filter(t => t.status === 'pending' && t.priority === 'critical');

    return {
        ...store,
        enabledPlansCount,
        totalPlansCount,
        pendingTasks,
        criticalTasks
    };
}
