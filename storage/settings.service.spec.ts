import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';
import { SettingsSignalsService } from './settings-signals.service';
import { FileBoxService } from './file-box.service';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SettingsService Integration', () => {
    let service: SettingsService;
    let fileBoxData: any;
    let mockFileBox: any;

    beforeEach(() => {
        fileBoxData = signal<Record<string, any>>({
            'app-settings|theme': 'light'
        });

        mockFileBox = {
            $data: fileBoxData,
            set: vi.fn((key: string, value: any) => {
                fileBoxData.update((d: Record<string, any>) => ({ ...d, [key]: value }));
            }),
            setAll: vi.fn((value) => {
                fileBoxData.set(value);
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

        service = TestBed.inject(SettingsService);
    });

    it('should behave as a scoped service at app-settings path', () => {
        const themeSignal = service.getNewSignal('default', 'theme');
        expect(themeSignal()).toBe('light');

        const nonExistent = service.getNewSignal('default', 'unknown');
        expect(nonExistent()).toBe('default');
    });

    it('should update settings via set', async () => {
        await service.set('dark', 'theme');

        expect(fileBoxData()['app-settings|theme']).toBe('dark');
        expect(mockFileBox.set).toHaveBeenCalledWith('app-settings|theme', 'dark');
    });
});
