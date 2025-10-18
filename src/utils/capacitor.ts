// Capacitor integration for Thai Script Learning PWA
// This file prepares the app for future mobile app conversion

import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard, KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { App } from '@capacitor/app';

class CapacitorService {
  private isNative = false;

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.initializeNativeFeatures();
  }

  private async initializeNativeFeatures() {
    if (!this.isNative) return;

    try {
      // Configure status bar for dark theme
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#111827' });

      // Configure keyboard behavior
      await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
      await Keyboard.setStyle({ style: KeyboardStyle.Dark });

      // Hide splash screen after app is ready
      await SplashScreen.hide();

      // Set up app state listeners
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
      });

      App.addListener('appUrlOpen', (event) => {
        console.log('App opened with URL:', event.url);
      });

    } catch (error) {
      console.warn('Capacitor initialization error:', error);
    }
  }

  // Haptic feedback for touch interactions
  async triggerHapticFeedback(style: 'light' | 'medium' | 'heavy' = 'light') {
    if (!this.isNative) return;

    try {
      const impactStyle = style === 'light' ? ImpactStyle.Light : 
                         style === 'medium' ? ImpactStyle.Medium : 
                         ImpactStyle.Heavy;
      
      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  // Check if running on native platform
  isNativePlatform(): boolean {
    return this.isNative;
  }

  // Get platform information
  getPlatform(): string {
    return Capacitor.getPlatform();
  }

  // Check if specific platform
  isPlatform(platform: 'ios' | 'android' | 'web'): boolean {
    return Capacitor.getPlatform() === platform;
  }
}

// Export singleton instance
export const capacitorService = new CapacitorService();

// Export individual functions for easy use
export const {
  triggerHapticFeedback,
  isNativePlatform,
  getPlatform,
  isPlatform
} = capacitorService;
