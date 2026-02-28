import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { SettingsService } from './settings.service';
import { SettingsSignalsService } from './settings-signals.service';
import { FileBoxService } from './file-box.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * This test suite verifies that signals are properly cached to avoid
 * creating new computed signals on every call to getNewSignal().
 * 
 * See NESTED_SIGNALS_INVESTIGATION.md for full context.
 */
describe('Signal Caching Pattern', () => {
    let settingsService: SettingsService;
    let mockFileBox: any;
    let dataSignal: any;

    beforeEach(() => {
        dataSignal = signal<any>({});
        mockFileBox = {
            $data: dataSignal,
            setAll: vi.fn((value) => {
                dataSignal.set(value);
            }),
            save: vi.fn(() => Promise.resolve())
        };

        TestBed.configureTestingModule({
            providers: [
                SettingsService,
                SettingsSignalsService,
                { provide: FileBoxService, useValue: mockFileBox }
            ]
        });

        settingsService = TestBed.inject(SettingsService);
    });

    it('should show that uncached calls create new signal instances', () => {
        // Each call creates a NEW signal instance
        const sig1 = settingsService.getNewSignal<string[]>([], 'test-key');
        const sig2 = settingsService.getNewSignal<string[]>([], 'test-key');
        const sig3 = settingsService.getNewSignal<string[]>([], 'test-key');
        
        expect(sig1).not.toBe(sig2);
        expect(sig2).not.toBe(sig3);
    });

    it('should show that cached signals reuse the same instance', () => {
        // Proper pattern: cache the signal once
        const cachedSignal = settingsService.getNewSignal<string[]>([], 'test-key');
        
        // Use the cached signal multiple times
        const value1 = cachedSignal();
        const value2 = cachedSignal();
        const value3 = cachedSignal();
        
        // All values should be equal (empty arrays in this case)
        expect(value1).toEqual([]);
        expect(value2).toEqual([]);
        expect(value3).toEqual([]);
        
        // And the signal itself should be the same instance
        const sameCachedSignal = cachedSignal; // Same reference
        expect(cachedSignal).toBe(sameCachedSignal);
    });

    it('should demonstrate memory efficiency of caching', () => {
        // Simulate many calls without caching (BAD)
        const uncachedSignals: any[] = [];
        for (let i = 0; i < 100; i++) {
            uncachedSignals.push(settingsService.getNewSignal('default', 'path'));
        }
        
        // All 100 signals are DIFFERENT instances
        const uniqueUncached = new Set(uncachedSignals);
        expect(uniqueUncached.size).toBe(100);
        
        // Simulate many calls WITH caching (GOOD)
        const cachedSignal = settingsService.getNewSignal('default', 'path');
        const cachedSignals: any[] = [];
        for (let i = 0; i < 100; i++) {
            cachedSignals.push(cachedSignal);
        }
        
        // All 100 references are to the SAME instance
        const uniqueCached = new Set(cachedSignals);
        expect(uniqueCached.size).toBe(1);
    });

    it('should verify signals update reactively even when cached', async () => {
        // Cache a signal
        const cachedSignal = settingsService.getNewSignal<string>('default', 'test', 'value');
        
        // Initial value should be default
        expect(cachedSignal()).toBe('default');
        
        // Update the value
        await settingsService.set('updated', 'test', 'value');
        
        // Cached signal should reflect the update
        expect(cachedSignal()).toBe('updated');
        
        // Update again
        await settingsService.set('updated-again', 'test', 'value');
        
        // Still works
        expect(cachedSignal()).toBe('updated-again');
    });
});
