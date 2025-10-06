import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, ThemeConfig, ThemeType } from './theme.service';

@Component({
  selector: 'app-theme-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-picker-container">
      <div class="theme-header">
        <h3>Themes</h3>
        <button
          class="dynamic-toggle"
          [class.active]="themeService.dynamicMode()"
          (click)="toggleDynamic()"
          title="Extract colors from album art">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Dynamic
        </button>
      </div>

      <div class="themes-grid">
        @for (theme of themes; track theme.name) {
          <button
            class="theme-card"
            [class.active]="themeService.currentTheme() === theme.name"
            [style.--preview-accent]="theme.accent"
            [style.--preview-bg]="theme.background"
            [style.--preview-surface]="theme.surface"
            [style.--preview-text]="theme.text"
            (click)="selectTheme(theme.name)">
            <div class="theme-preview">
              <div class="preview-bg">
                <div class="preview-surface">
                  <div class="preview-accent-bar"></div>
                  <div class="preview-text-lines">
                    <div class="line"></div>
                    <div class="line short"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="theme-name">{{ theme.displayName }}</div>
            @if (themeService.currentTheme() === theme.name) {
              <div class="check-icon">✓</div>
            }
          </button>
        }
      </div>

      @if (themeService.dynamicMode()) {
        <div class="dynamic-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>Theme colors will adapt to album artwork</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .theme-picker-container {
      padding: 1.5rem;
      max-width: 500px;
    }

    .theme-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .theme-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .dynamic-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--color-surface-3);
      background: var(--color-surface);
      color: var(--color-text-dim);
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .dynamic-toggle:hover {
      background: var(--color-surface-2);
      border-color: var(--color-accent);
    }

    .dynamic-toggle.active {
      background: var(--color-accent-fade);
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    .dynamic-toggle svg {
      width: 18px;
      height: 18px;
      stroke-width: 2;
    }

    .themes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .theme-card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
      border: 2px solid transparent;
      background: var(--color-surface);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .theme-card:hover {
      background: var(--color-surface-2);
      transform: translateY(-2px);
    }

    .theme-card.active {
      border-color: var(--color-accent);
      background: var(--color-accent-fade);
    }

    .theme-preview {
      width: 100%;
      aspect-ratio: 16 / 10;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .preview-bg {
      width: 100%;
      height: 100%;
      background: var(--preview-bg);
      padding: 6px;
    }

    .preview-surface {
      width: 100%;
      height: 100%;
      background: var(--preview-surface);
      border-radius: 4px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .preview-accent-bar {
      width: 40%;
      height: 3px;
      background: var(--preview-accent);
      border-radius: 2px;
    }

    .preview-text-lines {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-top: 4px;
    }

    .preview-text-lines .line {
      height: 2px;
      background: var(--preview-text);
      opacity: 0.6;
      border-radius: 1px;
    }

    .preview-text-lines .line.short {
      width: 60%;
    }

    .theme-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text);
      text-align: center;
    }

    .check-icon {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 24px;
      height: 24px;
      background: var(--color-accent);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
    }

    .dynamic-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--color-accent-soft);
      border: 1px solid var(--color-accent-fade);
      border-radius: 8px;
      color: var(--color-text-dim);
      font-size: 0.875rem;
    }

    .dynamic-info svg {
      flex-shrink: 0;
      stroke-width: 2;
    }

    @media (max-width: 640px) {
      .themes-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }

      .theme-picker-container {
        padding: 1rem;
      }
    }
  `]
})
export class ThemePickerComponent {
  themeService = inject(ThemeService);
  themes: ThemeConfig[] = this.themeService.getThemes();

  selectTheme(themeName: ThemeType) {
    if (themeName !== 'dynamic') {
      this.themeService.setTheme(themeName);
    }
  }

  toggleDynamic() {
    const newState = !this.themeService.dynamicMode();
    this.themeService.toggleDynamicMode(newState);
  }
}
