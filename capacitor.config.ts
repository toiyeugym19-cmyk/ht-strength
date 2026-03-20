import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.htstrength.gym',
  appName: 'HT Strength Gym',
  webDir: 'dist',
  ios: {
    scheme: 'HT Strength Gym',
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#0D0D0F'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#0D0D0F',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0D0D0F'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    }
  },
  server: {
    // Enable this for development on device
    // url: 'http://192.168.1.x:5173',
    // cleartext: true
  }
};

export default config;
