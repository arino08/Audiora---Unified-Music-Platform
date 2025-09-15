import { Injectable, signal } from '@angular/core';

// Lightweight color extraction: sample a small canvas grid and compute dominant average & accent
@Injectable({ providedIn: 'root' })
export class ThemeService {
  accent = signal<string>('#2486ff');
  backgroundGradient = signal<string>('');
  private defaultAccent = '#2486ff';
  private lastImageUrl: string | null = null;

  async applyFromImage(src?: string | null) {
    if (!src) { this.reset(); return; }
    if (src === this.lastImageUrl) return; // avoid re-processing
    this.lastImageUrl = src;
    try {
      const img = await this.loadImage(src);
      const { accent, dark } = this.extract(img);
      this.accent.set(accent);
      this.backgroundGradient.set(`radial-gradient(circle at 30% 40%, ${accent}22, transparent 70%), linear-gradient(140deg, ${dark}, #05070b 60%, #04060a)`);
      this.pushToDocument(accent, dark);
    } catch {
      this.reset();
    }
  }

  reset() {
    this.lastImageUrl = null;
    this.accent.set(this.defaultAccent);
    this.backgroundGradient.set('');
    this.pushToDocument(this.defaultAccent, '#060a10');
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
