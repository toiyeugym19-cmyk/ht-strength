import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

// ============================================================
//  Device types
// ============================================================
export type DeviceType = 'iphone' | 'ipad' | 'android' | 'web';

export interface DeviceInfo {
    type: DeviceType;
    isTablet: boolean;
    isNative: boolean;
    platform: string;
    screenWidth: number;
    screenHeight: number;
}

// ============================================================
//  Detection logic
// ============================================================
function detectDevice(): DeviceInfo {
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform();
    const w = typeof window !== 'undefined' ? window.innerWidth : 375;
    const h = typeof window !== 'undefined' ? window.innerHeight : 812;

    let type: DeviceType = 'web';
    let isTablet = false;

    if (isNative) {
        if (platform === 'ios') {
            const ua = navigator.userAgent || '';
            const isIPad = ua.includes('iPad') ||
                (ua.includes('Macintosh') && 'ontouchend' in document) ||
                Math.min(w, h) >= 768;
            type = isIPad ? 'ipad' : 'iphone';
            isTablet = isIPad;
        } else if (platform === 'android') {
            type = 'android';
            isTablet = Math.min(w, h) >= 600;
        }
    } else {
        // Web browser: ALWAYS use mobile mode
        // Even on desktop, we show mobile UI since the app targets mobile users
        type = 'web';
        isTablet = false;
    }

    return { type, isTablet, isNative, platform, screenWidth: w, screenHeight: h };
}

// ============================================================
//  React Hook
// ============================================================
export function useDeviceDetect(): DeviceInfo {
    const [device, setDevice] = useState<DeviceInfo>(detectDevice);

    useEffect(() => {
        const onResize = () => setDevice(detectDevice());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return device;
}

// ============================================================
//  Quick helpers
// ============================================================
export const isIPad = () => detectDevice().type === 'ipad';
export const isIPhone = () => detectDevice().type === 'iphone';
export const isTablet = () => detectDevice().isTablet;
export const isNativeApp = () => detectDevice().isNative;
