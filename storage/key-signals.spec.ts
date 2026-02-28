import { computed, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { KeySignals } from './key-signals';

class TestKeySignals extends KeySignals {
    private dataSignal = signal<Record<string, any>>({});

    public override $data() {
        return this.dataSignal();
    }

    public override async setRawValue(key: string, value: any) {
        this.dataSignal.update(d => ({ ...d, [key]: value }));
    }

    public override async setMultipleRawValues(values: Record<string, any>) {
        this.dataSignal.set(values);
    }

    // Helper to simulate reloading the entire file
    public simulateReload(newData: Record<string, any>) {
        this.dataSignal.set(newData);
    }
}

describe('KeySignals', () => {
    let service: TestKeySignals;

    beforeEach(() => {
        service = new TestKeySignals();
    });

    it('should return default value for non-existent key', () => {
        const sig = service.getNewSignal('default', 'a', 'b');
        expect(sig()).toBe('default');
    });

    it('should return actual value when it exists', async () => {
        await service.set('actual', 'a', 'b');
        const sig = service.getNewSignal('default', 'a', 'b');
        expect(sig()).toBe('actual');
        expect(service.getValue('default', 'a', 'b')).toBe('actual');
    });

    it('should update reactively', async () => {
        const sig = service.getNewSignal('default', 'a', 'b');
        expect(sig()).toBe('default');

        await service.set('updated', 'a', 'b');
        expect(sig()).toBe('updated');
    });

    it('should handle dots in path components correctly with separator', async () => {
        await service.set('value', 'repo.path', 'zoom');
        // Canonical key should be "repo.path|zoom"
        expect(service.getCanonicalKey(['repo.path', 'zoom'])).toBe('repo.path|zoom');

        const sig = service.getNewSignal('def', 'repo.path', 'zoom');
        expect(sig()).toBe('value');
    });

    it('should clear by prefix', async () => {
        await service.set(1, 'prefix', 'a');
        await service.set(2, 'prefix', 'b');
        await service.set(3, 'other', 'c');

        const sigA = service.getNewSignal(0, 'prefix', 'a');
        const sigB = service.getNewSignal(0, 'prefix', 'b');
        const sigC = service.getNewSignal(0, 'other', 'c');

        expect(sigA()).toBe(1);
        expect(sigB()).toBe(2);
        expect(sigC()).toBe(3);

        await service.clearByPrefix('prefix');

        expect(sigA()).toBe(0);
        expect(sigB()).toBe(0);
        expect(sigC()).toBe(3);
    });

    it('should not clear partial matches of prefix components', async () => {
        await service.set(1, 'prefix', 'a');
        await service.set(2, 'prefix-more', 'b');

        await service.clearByPrefix('prefix');

        expect(service.getNewSignal(0, 'prefix', 'a')()).toBe(0);
        expect(service.getNewSignal(0, 'prefix-more', 'b')()).toBe(2);
    });

    describe('Reactivity Specifics', () => {
        it('should trigger signal when its specific value changes', async () => {
            const sig = service.getNewSignal('def', 'key');
            let evaluationCount = 0;
            const derivation = computed(() => {
                sig();
                return ++evaluationCount;
            });

            derivation(); // First evaluation
            expect(evaluationCount).toBe(1);

            await service.set('new', 'key');
            derivation(); // Should re-evaluate
            expect(evaluationCount).toBe(2);

            await service.set('new', 'other');
            derivation(); // Should NOT re-evaluate (value of 'key' is still 'new')
            expect(evaluationCount).toBe(2);
        });

        it('should trigger signal when its key is removed via clearByPrefix', async () => {
            await service.set('value', 'a', 'b');
            const sig = service.getNewSignal('def', 'a', 'b');

            let evaluationCount = 0;
            const derivation = computed(() => {
                sig();
                return ++evaluationCount;
            });

            derivation();
            expect(evaluationCount).toBe(1);

            await service.clearByPrefix('a');

            expect(sig()).toBe('def');
            derivation();
            expect(evaluationCount).toBe(2);
        });

        it('should NOT trigger signal via clearByPrefix if its key is NOT affected', async () => {
            await service.set('val-a', 'a', 'x');
            await service.set('val-b', 'b', 'y');

            const sigA = service.getNewSignal('def', 'a', 'x');
            const sigB = service.getNewSignal('def', 'b', 'y');

            let evalA = 0;
            let evalB = 0;
            const derA = computed(() => { sigA(); return ++evalA; });
            const derB = computed(() => { sigB(); return ++evalB; });

            derA(); derB();
            expect(evalA).toBe(1);
            expect(evalB).toBe(1);

            await service.clearByPrefix('a');

            derA(); derB();
            expect(evalA).toBe(2); // Changed to default
            expect(evalB).toBe(1); // Unaffected
        });

        it('should trigger affected signals when the whole data map is reloaded', async () => {
            await service.set('old', 'key');
            const sig = service.getNewSignal('def', 'key');

            let evaluationCount = 0;
            const derivation = computed(() => {
                sig();
                return ++evaluationCount;
            });

            derivation();
            expect(evaluationCount).toBe(1);

            service.simulateReload({ 'key': 'brand-new', 'other': 'val' });

            expect(sig()).toBe('brand-new');
            derivation();
            expect(evaluationCount).toBe(2);
        });

        it('should NOT trigger signals after a reload if their value remained the same', async () => {
            await service.set('constant', 'key');
            const sig = service.getNewSignal('def', 'key');

            let evaluationCount = 0;
            const derivation = computed(() => {
                sig();
                return ++evaluationCount;
            });

            derivation();
            expect(evaluationCount).toBe(1);

            // Reload with same value for 'key'
            service.simulateReload({ 'key': 'constant', 'something-else': 'changed' });

            derivation();
            expect(evaluationCount).toBe(1); // Should NOT have re-evaluated downstream
        });
    });
});
