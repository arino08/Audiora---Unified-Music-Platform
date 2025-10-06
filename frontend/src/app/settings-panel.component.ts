import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemePickerComponent } from './theme-picker.component';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [CommonModule, ThemePickerComponent],
  template: `
    @if (isOpen()) {
      <div class="settings-backdrop" (click)="close()"></div>
      <div class="settings-panel" @slideIn>
        <div class="settings-header">
          <h2>Settings</h2>
          <button class="close-btn" (click)="close()" aria-label="Close settings">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="settings-content">
          <section class="settings-section">
            <app-theme-picker />
          </section>

          <!-- Future settings sections can be added here -->
          <!-- <section class="settings-section">
            <h3>Audio Quality</h3>
            ...
          </section> -->
        </div>
      </div>
    }
  `,
  styles: [`
    .settings-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 999;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .settings-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      max-width: 600px;
      height: 100vh;
      background: var(--color-background);
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      animation: slideInRight 0.3s ease-out;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    .settings-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--color-surface-3);
      background: var(--color-surface);
    }

    .settings-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .close-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--color-text-dim);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: var(--color-surface-2);
      color: var(--color-text);
    }

    .close-btn svg {
      stroke-width: 2;
    }

    .settings-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0;
    }

    .settings-section {
      padding: 1rem 0;
      border-bottom: 1px solid var(--color-surface-2);
    }

    .settings-section:last-child {
      border-bottom: none;
    }

    .settings-section h3 {
      margin: 0 0 1rem 0;
      padding: 0 2rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--color-text);
    }

    @media (max-width: 640px) {
      .settings-panel {
        max-width: 100%;
      }

      .settings-header {
        padding: 1rem 1.5rem;
      }
    }

    /* Scrollbar styling */
    .settings-content::-webkit-scrollbar {
      width: 8px;
    }

    .settings-content::-webkit-scrollbar-track {
      background: var(--color-surface);
    }

    .settings-content::-webkit-scrollbar-thumb {
      background: var(--color-surface-3);
      border-radius: 4px;
    }

    .settings-content::-webkit-scrollbar-thumb:hover {
      background: var(--color-text-dim);
    }
  `]
})
export class SettingsPanelComponent {
  isOpen = signal(false);

  open() {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }
}
