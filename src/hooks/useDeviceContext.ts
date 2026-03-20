import { useState, useEffect } from 'react';

// ============================================================
//  useDeviceContext — Mobile / Tablet / Desktop, orientation, safe-area
//  Theo MOBILE_TABLET_UI_MASTERPLAN.md Phase 1.1
// ============================================================

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
} as const;

export interface DeviceContextValue {
    /** mobile < 768px | tablet 768–1024 | desktop > 1024 */
    device: DeviceType;
    /** Chiều rộng viewport */
    width: number;
    /** Chiều cao viewport */
    height: number;
    /** portrait | landscape */
    orientation: 'portrait' | 'landscape';
    /** Có phải mobile (touch-first) */
    isMobile: boolean;
    /** Có phải tablet */
    isTablet: boolean;
    /** Có phải desktop */
    isDesktop: boolean;
    /** Safe area insets (CSS env(), dùng cho notch iPhone) — giá trị ước lượng nếu env chưa có */
    safeArea: { top: number; right: number; bottom: number; left: number };
}

function getDeviceType(width: number): DeviceType {
    if (width < BREAKPOINTS.mobile) return 'mobile';
    if (width < BREAKPOINTS.tablet) return 'tablet';
    return 'desktop';
}

function getSafeArea(): { top: number; right: number; bottom: number; left: number } {
    if (typeof window === 'undefined') return { top: 0, right: 0, bottom: 0, left: 0 };
    // Trình duyệt hỗ trợ safe-area-inset qua CSS env(); app dùng padding-bottom: env(safe-area-inset-bottom). Giá trị mặc định cho iPhone home indicator.
    return {
        top: 0,
        right: 0,
        bottom: 20,
        left: 0,
    };
}

export function useDeviceContext(): DeviceContextValue {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
    const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 768);
    const [safeArea, setSafeArea] = useState(() => getSafeArea());

    useEffect(() => {
        const update = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
            setSafeArea(getSafeArea());
        };
        update();
        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
        };
    }, []);

    const device = getDeviceType(width);
    const orientation = height >= width ? 'portrait' : 'landscape';

    return {
        device,
        width,
        height,
        orientation,
        isMobile: device === 'mobile',
        isTablet: device === 'tablet',
        isDesktop: device === 'desktop',
        safeArea,
    };
}
