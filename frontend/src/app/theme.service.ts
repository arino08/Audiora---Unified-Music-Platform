import { Injectable, signal } from '@angular/core';

export type ThemeType = 'dark' | 'light' | 'neon' | 'minimal' | 'retro' | 'ocean' | 'sunset' | 'forest' | 'dynamic';

export interface ThemeConfig {
  name: ThemeType;
  displayName: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textDim: string;
  isDark: boolean;
}

// Lightweight color extraction: sample a small canvas grid and compute dominant average & accent
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'audiora_theme';
  private readonly DYNAMIC_MODE_KEY = 'audiora_dynamic_theme';

  // Signals
  currentTheme = signal<ThemeType>('dark');
  dynamicMode = signal<boolean>(false);
  accent = signal<string>('#2486ff');
  backgroundGradient = signal<string>('');

  private defaultAccent = '#2486ff';
  private lastImageUrl: string | null = null;

  // Predefined themes
  private themes: Record<Exclude<ThemeType, 'dynamic'>, ThemeConfig> = {
    dark: {
      name: 'dark',
      displayName: 'Dark Mode',
      accent: '#2486ff',
      background: '#060a10',
      surface: '#0f1419',
      text: '#e1e8ed',
      textDim: '#8899a6',
      isDark: true
    },
    light: {
      name: 'light',
      displayName: 'Light Mode',
      accent: '#1d4ed8',
      background: '#ffffff',
      surface: '#f5f7fa',
      text: '#1a1a1a',
      textDim: '#666666',
      isDark: false
    },
    neon: {
      name: 'neon',
      displayName: 'Neon Dreams',
      accent: '#ff00ff',
      background: '#0a0015',
      surface: '#1a0033',
      text: '#00ffff',
      textDim: '#ff00ff',
      isDark: true
    },
    minimal: {
      name: 'minimal',
      displayName: 'Minimal',
      accent: '#2563eb',
      background: '#fafafa',
      surface: '#ffffff',
      text: '#171717',
      textDim: '#737373',
      isDark: false
    },
    retro: {
      name: 'retro',
      displayName: 'Retro Wave',
      accent: '#ff6ec7',
      background: '#16161a',
      surface: '#242629',
      text: '#fffffe',
      textDim: '#94a1b2',
      isDark: true
    },
    ocean: {
      name: 'ocean',
      displayName: 'Ocean Breeze',
      accent: '#06b6d4',
      background: '#0c1e2e',
      surface: '#0f2942',
      text: '#e0f2fe',
      textDim: '#67e8f9',
      isDark: true
    },
    sunset: {
      name: 'sunset',
      displayName: 'Sunset Vibes',
      accent: '#f97316',
      background: '#1e1410',
      surface: '#2e1f18',
      text: '#fff7ed',
      textDim: '#fdba74',
      isDark: true
    },
    forest: {
      name: 'forest',
      displayName: 'Forest Night',
      accent: '#10b981',
      background: '#0a1612',
      surface: '#14241e',
      text: '#d1fae5',
      textDim: '#6ee7b7',
      isDark: true
    }
  };

  constructor() {
    this.loadSettings();
  }

  /**
   * Get all available themes
   */
  getThemes(): ThemeConfig[] {
    return Object.values(this.themes);
  }

  /**
   * Get current theme configuration
   */
  getCurrentThemeConfig(): ThemeConfig | null {
    const themeName = this.currentTheme();
    if (themeName === 'dynamic') return null;
    return this.themes[themeName];
  }

  /**
   * Set theme by name
   */
  setTheme(themeName: Exclude<ThemeType, 'dynamic'>) {
    this.currentTheme.set(themeName);
    this.dynamicMode.set(false);
    this.lastImageUrl = null;
    this.applyTheme(this.themes[themeName]);
    this.saveSettings();
  }

  /**
   * Toggle dynamic theme mode
   */
  toggleDynamicMode(enabled: boolean) {
    this.dynamicMode.set(enabled);
    localStorage.setItem(this.DYNAMIC_MODE_KEY, enabled.toString());
    if (!enabled) {
      const theme = this.themes[this.currentTheme() === 'dynamic' ? 'dark' : this.currentTheme() as Exclude<ThemeType, 'dynamic'>];
      this.applyTheme(theme);
    }
  }

  /**
   * Apply theme configuration
   */
  private applyTheme(config: ThemeConfig) {
    const root = document.documentElement;

    // Set CSS variables
    root.style.setProperty('--color-accent', config.accent);
    root.style.setProperty('--color-accent-hover', this.adjustBrightness(config.accent, config.isDark ? 15 : -15));
    root.style.setProperty('--color-accent-fade', this.hexToRgba(config.accent, 0.18));
    root.style.setProperty('--color-accent-soft', this.hexToRgba(config.accent, 0.12));
    root.style.setProperty('--color-background', config.background);
    root.style.setProperty('--color-surface', config.surface);
    root.style.setProperty('--color-surface-2', this.adjustBrightness(config.surface, config.isDark ? 5 : -5));
    root.style.setProperty('--color-surface-3', this.adjustBrightness(config.surface, config.isDark ? 10 : -10));
    root.style.setProperty('--color-text', config.text);
    root.style.setProperty('--color-text-dim', config.textDim);
    root.style.setProperty('--dynamic-bg-overlay', config.background);

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', config.background);
    }

    // Update signals
    this.accent.set(config.accent);
    this.backgroundGradient.set('');
  }

  /**
   * Adjust brightness of hex color
   */
  private adjustBrightness(hex: string, percent: number): string {
    const { r, g, b } = this.hexToRgb(hex);
    const adjust = (val: number) => Math.max(0, Math.min(255, val + (percent * 2.55)));
    return this.rgbToHex(adjust(r), adjust(g), adjust(b));
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings() {
    localStorage.setItem(this.STORAGE_KEY, this.currentTheme());
    localStorage.setItem(this.DYNAMIC_MODE_KEY, this.dynamicMode().toString());
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as ThemeType;
    const savedDynamic = localStorage.getItem(this.DYNAMIC_MODE_KEY);

    if (savedTheme && savedTheme !== 'dynamic' && this.themes[savedTheme]) {
      this.currentTheme.set(savedTheme);
      this.applyTheme(this.themes[savedTheme]);
    } else {
      this.applyTheme(this.themes.dark);
    }

    if (savedDynamic) {
      this.dynamicMode.set(savedDynamic === 'true');
    }
  }

  // ============ Dynamic Theme from Album Art ============

  /**
   * Apply dynamic theme from album art image
   * Only works when dynamic mode is enabled
   */
  async applyFromImage(src?: string | null) {
    if (!this.dynamicMode()) return; // Only apply if dynamic mode is enabled
    if (!src) { this.reset(); return; }
    if (src === this.lastImageUrl) return; // avoid re-processing
    this.lastImageUrl = src;
    try {
      const img = await this.loadImage(src);
      const { accent, dark } = this.extract(img);
      this.currentTheme.set('dynamic');
      this.accent.set(accent);
      this.backgroundGradient.set(`radial-gradient(circle at 30% 40%, ${accent}22, transparent 70%), linear-gradient(140deg, ${dark}, #05070b 60%, #04060a)`);
      this.pushToDocument(accent, dark);
    } catch (err) {
      console.error('Failed to extract colors from image:', err);
      this.reset();
    }
  }

  reset() {
    this.lastImageUrl = null;
    const theme = this.themes[this.currentTheme() === 'dynamic' ? 'dark' : this.currentTheme() as Exclude<ThemeType, 'dynamic'>];
    this.applyTheme(theme);
  }

  private pushToDocument(accent: string, darkBase: string) {
    const root = document.documentElement;
    root.style.setProperty('--color-accent', accent);
    root.style.setProperty('--color-accent-hover', accent);
    root.style.setProperty('--color-accent-fade', this.hexToRgba(accent, 0.18));
    root.style.setProperty('--color-accent-soft', this.hexToRgba(accent, 0.18));
    root.style.setProperty('--dynamic-bg-overlay', darkBase);
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private extract(img: HTMLImageElement): { accent: string; dark: string } {
    const canvas = document.createElement('canvas');
    const size = 40; // small sample
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { accent: this.defaultAccent, dark: '#060a10' };
    ctx.drawImage(img, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    let r = 0, g = 0, b = 0, count = 0;
    const freq: Record<string, number> = {};
    for (let i = 0; i < data.length; i += 4) {
      const rr = data[i], gg = data[i+1], bb = data[i+2];
      const lum = 0.2126*rr + 0.7152*gg + 0.0722*bb;
      // skip near-white
      if (lum > 235) continue;
      r += rr; g += gg; b += bb; count++;
      const bucket = `${Math.round(rr/32)*32}_${Math.round(gg/32)*32}_${Math.round(bb/32)*32}`;
      freq[bucket] = (freq[bucket]||0)+1;
    }
    if (count === 0) return { accent: this.defaultAccent, dark: '#060a10' };
    const avg = { r: Math.round(r/count), g: Math.round(g/count), b: Math.round(b/count) };
    // dominant bucket as accent candidate
    let topBucket = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0]?.[0];
    let accent = topBucket ? '#' + topBucket.split('_').map(v => Number(v).toString(16).padStart(2,'0')).join('') : this.rgbToHex(avg.r, avg.g, avg.b);
    // ensure accent not too dark or dull -> boost saturation
    accent = this.boostColor(accent);
    const dark = this.darken(accent, 0.75);
    return { accent, dark };
  }

  private boostColor(hex: string): string {
    const { r,g,b } = this.hexToRgb(hex);
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let sat = max === 0 ? 0 : (max - min)/max;
    if (sat < 0.35) {
      // push mid channels
      const factor = 1.25;
      return this.rgbToHex(Math.min(255, r*factor), Math.min(255, g*factor), Math.min(255, b*factor));
    }
    return hex;
  }
  private darken(hex: string, amt: number): string {
    const { r,g,b } = this.hexToRgb(hex);
    return this.rgbToHex(r*(1-amt*0.6), g*(1-amt*0.6), b*(1-amt*0.6));
  }
  private hexToRgb(hex: string){
    const c = hex.replace('#','');
    return { r: parseInt(c.substring(0,2),16), g: parseInt(c.substring(2,4),16), b: parseInt(c.substring(4,6),16)};
  }
  private rgbToHex(r: number,g: number,b: number){
    return '#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
  }
  private hexToRgba(hex: string, a: number) {
    const { r,g,b } = this.hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }
}
