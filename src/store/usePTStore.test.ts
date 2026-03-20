import { describe, it, expect, beforeEach } from 'vitest';
import { usePTStore } from './usePTStore';

describe('usePTStore', () => {
    beforeEach(() => {
        usePTStore.setState({
            pts: [
                { id: 'pt1', name: 'Coach A', phone: '0901', status: 'Active', specialty: ['Strength'], joinDate: '2024-01-01', memberCount: 5 },
                { id: 'pt2', name: 'Coach B', phone: '0902', status: 'Inactive', specialty: ['Yoga'], joinDate: '2024-02-01', memberCount: 3 },
            ],
        });
    });

    it('addPT adds new PT', () => {
        const { addPT, pts } = usePTStore.getState();
        addPT({
            name: 'Coach New',
            phone: '090999',
            status: 'Active',
            specialty: ['HIIT'],
        });
        const next = usePTStore.getState().pts;
        expect(next.length).toBe(3);
        expect(next[0].name).toBe('Coach New');
        expect(next[0].memberCount).toBe(0);
    });

    it('updatePT updates PT', () => {
        const { updatePT } = usePTStore.getState();
        updatePT('pt1', { name: 'Coach A Updated', status: 'Inactive' });
        const pts = usePTStore.getState().pts;
        const pt1 = pts.find((p) => p.id === 'pt1');
        expect(pt1?.name).toBe('Coach A Updated');
        expect(pt1?.status).toBe('Inactive');
    });

    it('deletePT removes PT', () => {
        const { deletePT } = usePTStore.getState();
        deletePT('pt1');
        const pts = usePTStore.getState().pts;
        expect(pts.length).toBe(1);
        expect(pts.find((p) => p.id === 'pt1')).toBeUndefined();
    });
});
