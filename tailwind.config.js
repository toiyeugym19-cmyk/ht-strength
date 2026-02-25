/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/konsta/react/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // 🎨 CUSTOM FONT SYSTEM (UI UX Pro Max)
            fontFamily: {
                display: ['Rajdhani', 'system-ui', 'sans-serif'], // Bold, Athletic, Tech
                sans: ['Inter', 'system-ui', 'sans-serif'],       // Clean, Modern
                mono: ['JetBrains Mono', 'monospace'],            // Stats, Numbers
                // Konsta compatibility
                ios: ['-apple-system', 'SF Pro Text', 'system-ui'],
                material: ['Roboto', 'system-ui'],
            },

            // 🎨 ATHLETIC ENERGY PALETTE (Replaces Generic Purple)
            colors: {
                // Primary: Energetic Orange (Main CTAs, Highlights)
                primary: {
                    DEFAULT: '#FF6B35',
                    hover: '#FF8555',
                    light: '#FFAB88',
                    dark: '#E65525',
                    glow: 'rgba(255, 107, 53, 0.4)',
                },

                // Secondary: Electric Cyan (Accents, Secondary Actions)
                secondary: {
                    DEFAULT: '#00D9FF',
                    hover: '#33E3FF',
                    light: '#66EDFF',
                    dark: '#00B8D9',
                    glow: 'rgba(0, 217, 255, 0.6)',
                },

                // Tertiary: Power Purple (Premium Features)
                tertiary: {
                    DEFAULT: '#9D4EDD',
                    hover: '#B066E7',
                    light: '#C38AEF',
                    dark: '#7B3DB3',
                },

                // Status Colors
                success: {
                    DEFAULT: '#06FFA5',
                    light: '#39FFB8',
                    dark: '#05CC84',
                },
                warning: {
                    DEFAULT: '#FFB627',
                    light: '#FFC952',
                    dark: '#E6A324',
                },
                error: {
                    DEFAULT: '#FF3B5C',
                    light: '#FF6B83',
                    dark: '#E6354D',
                },

                // Background System (Dark Mode Optimized)
                bg: {
                    dark: '#0A0E27',       // Deep Navy - Main bg
                    card: '#1A1F3A',       // Dark Slate - Cards
                    elevated: '#252B4A',   // Elevated elements
                    panel: 'rgba(30, 30, 48, 0.4)',   // Konsta compat
                    hover: 'rgba(45, 45, 70, 0.6)',   // Konsta compat
                },

                // Text System
                text: {
                    primary: '#FFFFFF',
                    secondary: '#8B92B2',   // Muted Blue-Gray
                    muted: '#5A5F7D',       // Even more muted
                    main: '#ffffff',        // Konsta compat
                },

                // Border
                border: {
                    DEFAULT: 'rgba(255, 255, 255, 0.08)',
                    hover: 'rgba(255, 255, 255, 0.16)',
                },

                // Legacy compatibility
                accent: {
                    DEFAULT: '#00D9FF',
                    glow: 'rgba(0, 212, 255, 0.5)',
                },
                danger: '#FF3B5C',
            },

            // 🎨 SHADOW SYSTEM (Professional Depth)
            boxShadow: {
                'sm': '0 2px 8px rgba(0,0,0,0.12)',
                'md': '0 4px 16px rgba(0,0,0,0.16)',
                'lg': '0 8px 32px rgba(0,0,0,0.24)',
                'xl': '0 12px 48px rgba(0,0,0,0.32)',
                'glow': '0 0 24px rgba(255,107,53,0.4)',
                'glow-lg': '0 0 40px rgba(255,107,53,0.5)',
                'neon': '0 0 20px rgba(0,217,255,0.6)',
                'neon-lg': '0 0 32px rgba(0,217,255,0.7)',
                // Legacy
                'glow-sm': '0 0 10px rgba(255,107,53,0.3)',
                'glow-md': '0 0 20px rgba(255,107,53,0.4)',
                'neon-cyan': '0 0 10px rgba(0,217,255,0.5)',
            },

            // 🎨 SPACING SYSTEM (8px base)
            spacing: {
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                '2xl': '48px',
                '3xl': '64px',
            },

            // 🎨 BORDER RADIUS SYSTEM
            borderRadius: {
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                'xxl': '40px',
                'full': '9999px',
            },

            // 🎨 TRANSITION SYSTEM (200-300ms sweet spot)
            transitionDuration: {
                'fast': '150ms',
                'base': '250ms',
                'slow': '400ms',
            },

            // 🎨 ANIMATIONS
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },

            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { filter: 'brightness(1) drop-shadow(0 0 8px rgba(255,107,53,0.4))' },
                    '100%': { filter: 'brightness(1.2) drop-shadow(0 0 16px rgba(255,107,53,0.6))' },
                }
            }
        },
    },
    plugins: [],
}
