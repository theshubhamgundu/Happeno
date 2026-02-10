import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.happeno.app',
  appName: 'Happeno',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#FFF8F5",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#EC1C79",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
