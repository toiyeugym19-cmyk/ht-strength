import { describe, it, expect, beforeEach } from 'vitest';
import { useMemberStore } from './useMemberStore';

describe('useMemberStore', () => {
    beforeEach(() => {
        useMemberStore.setState({
            members: [
                {
                    id: 'm1',
                    name: 'Test Member',
                    phone: '0901',
                    status: 'Active',
                    membershipType: 'Gói 3 Tháng',
                    startDate: '2024-01-01',
                    expiryDate: '2024-04-01',
                    joinDate: '2024-01-01',
                    sessionsTotal: 90,
                    sessionsUsed: 10,
                    checkInHistory: [],
                    lastCheckIn: null,
                    assignedPT: 'Coach Thor',
                },
            ],
        });
    });

    it('performCheckIn records check-in', () => {
        const { performCheckIn } = useMemberStore.getState();
        performCheckIn('m1');
        const m = useMemberStore.getState().members[0];
        expect(m.sessionsUsed).toBe(11);
        expect(m.checkInHistory[0]?.type).toBe('Check-in');
    });

    it('performCheckOut removes today check-in', () => {
        const { performCheckIn, performCheckOut } = useMemberStore.getState();
        performCheckIn('m1');
        let m = useMemberStore.getState().members[0];
        expect(m.sessionsUsed).toBe(11);
        performCheckOut('m1');
        m = useMemberStore.getState().members[0];
        expect(m.sessionsUsed).toBe(10);
    });

    it('addMember creates member with correct fields', () => {
        const { addMember } = useMemberStore.getState();
        addMember({
            name: 'New Member',
            phone: '090999',
            status: 'Active',
            membershipType: 'Gói 1 Tháng',
            startDate: '2024-03-01',
            expiryDate: '2024-04-01',
            sessionsTotal: 30,
            lastCheckIn: null,
        });
        const members = useMemberStore.getState().members;
        const added = members.find((m) => m.name === 'New Member');
        expect(added).toBeDefined();
        expect(added?.sessionsUsed).toBe(0);
        expect(added?.checkInHistory).toEqual([]);
    });
});
