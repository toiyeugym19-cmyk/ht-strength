/**
 * Antigravity Extension: Multi-Platform Manager
 * Handles platform-specific optimizations and PWA lifecycle.
 */

export const PlatformManager = {
    isPWA: () => window.matchMedia('(display-mode: standalone)').matches,
    isIOS: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: () => /Android/.test(navigator.userAgent),

    // Haptic Feedback Simulation for Mobile
    triggerHaptic: (type: 'light' | 'medium' | 'heavy' = 'light') => {
        if ('vibrate' in navigator) {
            const patterns = {
                light: 10,
                medium: 30,
                heavy: 60
            };
            navigator.vibrate(patterns[type]);
        }
    },

    // Optimized Asset Loading
    getOptimizedImage: (url: string) => {
        // Simple logic to add sizing params if using a service like Cloudinary/Imgix
        // For local files, just returns the url
        return url;
    },

    // Browser/Platform Optimization
    initOptimizations: () => {
        // Prevent context menu on long press for mobile (optional)
        if (PlatformManager.isIOS() || PlatformManager.isAndroid()) {
            document.addEventListener('contextmenu', (e) => {
                if ((e.target as HTMLElement).tagName === 'IMG') return; // Allow image saving
                // e.preventDefault();
            });
        }
    }
};

export default PlatformManager;
