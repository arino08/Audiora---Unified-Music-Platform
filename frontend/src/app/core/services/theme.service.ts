import { Injectable, signal, computed, effect } from "@angular/core";

export type ThemeMode = "dark" | "light" | "system";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
}

export interface DynamicTheme {
  isActive: boolean;
  colors: ThemeColors;
  sourceImage?: string;
}

const DEFAULT_AURORA_COLORS: ThemeColors = {
  primary: "#a855f7", // purple
  secondary: "#14b8a6", // teal
  accent: "#ec4899", // pink
  muted: "#3b82f6", // blue
};

const STORAGE_KEYS = {
  THEME_MODE: "audiora_theme_mode",
  DYNAMIC_ENABLED: "audiora_dynamic_theme",
};

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  // Signals for reactive state
  private readonly _themeMode = signal<ThemeMode>("dark");
  private readonly _dynamicTheme = signal<DynamicTheme>({
    isActive: false,
    colors: DEFAULT_AURORA_COLORS,
  });
  private readonly _systemPrefersDark = signal<boolean>(true);

  // Computed values
  readonly themeMode = computed(() => this._themeMode());
  readonly dynamicTheme = computed(() => this._dynamicTheme());
  readonly isDarkMode = computed(() => {
    const mode = this._themeMode();
    if (mode === "system") {
      return this._systemPrefersDark();
    }
    return mode === "dark";
  });
  readonly currentColors = computed(() => this._dynamicTheme().colors);

  constructor() {
    this.initializeTheme();
    this.setupSystemThemeListener();

    // Effect to apply theme changes to DOM
    effect(() => {
      this.applyThemeToDOM();
    });

    // Effect to apply dynamic colors
    effect(() => {
      const theme = this._dynamicTheme();
      if (theme.isActive) {
        this.applyDynamicColors(theme.colors);
      } else {
        this.applyDynamicColors(DEFAULT_AURORA_COLORS);
      }
    });
  }

  /**
   * Initialize theme from storage or system preference
   */
  private initializeTheme(): void {
    // Load saved theme mode
    const savedMode = localStorage.getItem(
      STORAGE_KEYS.THEME_MODE,
    ) as ThemeMode | null;
    if (savedMode && ["dark", "light", "system"].includes(savedMode)) {
      this._themeMode.set(savedMode);
    }

    // Load dynamic theme preference
    const dynamicEnabled = localStorage.getItem(STORAGE_KEYS.DYNAMIC_ENABLED);
    if (dynamicEnabled === "true") {
      this._dynamicTheme.update((current) => ({ ...current, isActive: true }));
    }

    // Check system preference
    this._systemPrefersDark.set(
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
  }

  /**
   * Listen for system theme changes
   */
  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      this._systemPrefersDark.set(e.matches);
    });
  }

  /**
   * Apply current theme to DOM
   */
  private applyThemeToDOM(): void {
    const isDark = this.isDarkMode();
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#0a0a0f" : "#f8fafc");
    }
  }

  /**
   * Apply dynamic colors to CSS custom properties
   */
  private applyDynamicColors(colors: ThemeColors): void {
    const root = document.documentElement;
    root.style.setProperty("--dynamic-primary", colors.primary);
    root.style.setProperty("--dynamic-secondary", colors.secondary);
    root.style.setProperty("--dynamic-accent", colors.accent);
    root.style.setProperty("--dynamic-muted", colors.muted);

    // Set RGB versions for all colors to enable alpha transparency
    const primaryRgb = this.hexToRgb(colors.primary);
    const secondaryRgb = this.hexToRgb(colors.secondary);
    const accentRgb = this.hexToRgb(colors.accent);
    const mutedRgb = this.hexToRgb(colors.muted);

    if (primaryRgb) {
      root.style.setProperty(
        "--dynamic-primary-rgb",
        `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`,
      );
    }
    if (secondaryRgb) {
      root.style.setProperty(
        "--dynamic-secondary-rgb",
        `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`,
      );
    }
    if (accentRgb) {
      root.style.setProperty(
        "--dynamic-accent-rgb",
        `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`,
      );
    }
    if (mutedRgb) {
      root.style.setProperty(
        "--dynamic-muted-rgb",
        `${mutedRgb.r}, ${mutedRgb.g}, ${mutedRgb.b}`,
      );
    }
  }

  /**
   * Set the theme mode
   */
  setThemeMode(mode: ThemeMode): void {
    this._themeMode.set(mode);
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
  }

  /**
   * Toggle between dark and light mode
   */
  toggleTheme(): void {
    const current = this._themeMode();
    if (current === "system") {
      this.setThemeMode(this._systemPrefersDark() ? "light" : "dark");
    } else {
      this.setThemeMode(current === "dark" ? "light" : "dark");
    }
  }

  /**
   * Enable or disable dynamic theming
   */
  setDynamicThemeEnabled(enabled: boolean): void {
    this._dynamicTheme.update((current) => ({ ...current, isActive: enabled }));
    localStorage.setItem(STORAGE_KEYS.DYNAMIC_ENABLED, String(enabled));
  }

  /**
   * Extract colors from an album art image
   */
  async extractColorsFromImage(imageUrl: string): Promise<ThemeColors> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        try {
          const colors = this.analyzeImage(img);
          resolve(colors);
        } catch (error) {
          console.warn("Failed to analyze image, using defaults:", error);
          resolve(DEFAULT_AURORA_COLORS);
        }
      };

      img.onerror = () => {
        console.warn("Failed to load image for color extraction");
        resolve(DEFAULT_AURORA_COLORS);
      };

      img.src = imageUrl;
    });
  }

  /**
   * Update dynamic theme with colors from album art
   */
  async updateFromAlbumArt(imageUrl: string): Promise<void> {
    if (!this._dynamicTheme().isActive) {
      return;
    }

    const colors = await this.extractColorsFromImage(imageUrl);
    this._dynamicTheme.update((current) => ({
      ...current,
      colors,
      sourceImage: imageUrl,
    }));
  }

  /**
   * Reset to default aurora colors
   */
  resetToDefaultColors(): void {
    this._dynamicTheme.update((current) => ({
      ...current,
      colors: DEFAULT_AURORA_COLORS,
      sourceImage: undefined,
    }));
  }

  /**
   * Analyze image and extract dominant colors
   */
  private analyzeImage(img: HTMLImageElement): ThemeColors {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Use smaller size for faster processing
    const size = 100;
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(img, 0, 0, size, size);
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;

    // Extract colors using a simple color quantization approach
    const colorCounts: Map<
      string,
      { count: number; r: number; g: number; b: number }
    > = new Map();

    for (let i = 0; i < pixels.length; i += 4) {
      const r = Math.round(pixels[i] / 32) * 32;
      const g = Math.round(pixels[i + 1] / 32) * 32;
      const b = Math.round(pixels[i + 2] / 32) * 32;

      // Skip very dark or very light colors
      const brightness = (r + g + b) / 3;
      if (brightness < 30 || brightness > 225) continue;

      const key = `${r},${g},${b}`;
      const existing = colorCounts.get(key);

      if (existing) {
        existing.count++;
      } else {
        colorCounts.set(key, { count: 1, r, g, b });
      }
    }

    // Sort by count and get top colors
    const sortedColors = Array.from(colorCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    if (sortedColors.length < 2) {
      return DEFAULT_AURORA_COLORS;
    }

    // Find colors with good saturation and variety
    const vibrantColors = sortedColors.filter((c) => {
      const max = Math.max(c.r, c.g, c.b);
      const min = Math.min(c.r, c.g, c.b);
      const saturation = max > 0 ? (max - min) / max : 0;
      return saturation > 0.2;
    });

    const colorsToUse =
      vibrantColors.length >= 2 ? vibrantColors : sortedColors;

    // Select primary (most prominent vibrant color)
    const primary = colorsToUse[0];

    // Select secondary (different hue from primary)
    let secondary =
      colorsToUse.find((c, i) => {
        if (i === 0) return false;
        const hueDiff = Math.abs(this.getHue(c) - this.getHue(primary));
        return hueDiff > 30 || hueDiff < 330;
      }) ||
      colorsToUse[1] ||
      primary;

    // Select accent (most saturated or contrasting)
    const accent =
      colorsToUse.find((c, i) => {
        if (i === 0 || c === secondary) return false;
        return true;
      }) || this.adjustColor(primary, 30);

    // Muted is a desaturated version
    const muted = this.desaturate(primary);

    return {
      primary: this.rgbToHex(primary.r, primary.g, primary.b),
      secondary: this.rgbToHex(secondary.r, secondary.g, secondary.b),
      accent:
        typeof accent === "string"
          ? accent
          : this.rgbToHex(accent.r, accent.g, accent.b),
      muted: this.rgbToHex(muted.r, muted.g, muted.b),
    };
  }

  /**
   * Get hue from RGB color
   */
  private getHue(color: { r: number; g: number; b: number }): number {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    if (delta === 0) return 0;

    let hue = 0;
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }

    hue = Math.round(hue * 60);
    return hue < 0 ? hue + 360 : hue;
  }

  /**
   * Adjust color by shifting hue
   */
  private adjustColor(
    color: { r: number; g: number; b: number },
    hueDelta: number,
  ): string {
    const hsl = this.rgbToHsl(color.r, color.g, color.b);
    hsl.h = (hsl.h + hueDelta) % 360;
    const rgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  /**
   * Desaturate a color
   */
  private desaturate(color: { r: number; g: number; b: number }): {
    r: number;
    g: number;
    b: number;
  } {
    const hsl = this.rgbToHsl(color.r, color.g, color.b);
    hsl.s = Math.max(0, hsl.s - 0.4);
    return this.hslToRgb(hsl.h, hsl.s, hsl.l);
  }

  /**
   * Convert RGB to HSL
   */
  private rgbToHsl(
    r: number,
    g: number,
    b: number,
  ): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s, l };
  }

  /**
   * Convert HSL to RGB
   */
  private hslToRgb(
    h: number,
    s: number,
    l: number,
  ): { r: number; g: number; b: number } {
    h /= 360;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  /**
   * Convert RGB to hex
   */
  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number): string => {
      const hex = Math.max(0, Math.min(255, n)).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Convert hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Check if a color has sufficient contrast against background
   */
  hasGoodContrast(foreground: string, background: string): boolean {
    const fg = this.hexToRgb(foreground);
    const bg = this.hexToRgb(background);

    if (!fg || !bg) return true;

    const luminance = (r: number, g: number, b: number): number => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = luminance(fg.r, fg.g, fg.b);
    const l2 = luminance(bg.r, bg.g, bg.b);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    // WCAG AA requires 4.5:1 for normal text
    return ratio >= 4.5;
  }
}
