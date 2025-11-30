import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService } from '../../../core/services/toast.service';
import { Toast } from '../../../core/models';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast"
          [class]="'toast-' + toast.type"
          [@slideIn]
          role="alert"
        >
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              }
              @case ('info') {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              }
            }
          </div>

          <div class="toast-content">
            <h4 class="toast-title">{{ toast.title }}</h4>
            @if (toast.message) {
              <p class="toast-message">{{ toast.message }}</p>
            }
            @if (toast.action) {
              <button
                class="toast-action"
                (click)="toastService.executeAction(toast.id)"
              >
                {{ toast.action.label }}
              </button>
            }
          </div>

          <button
            class="toast-dismiss"
            (click)="toastService.dismiss(toast.id)"
            aria-label="Dismiss notification"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 100px; /* Above the player */
      right: var(--space-4);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      max-width: 400px;
      width: 100%;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      padding: var(--space-4);
      background: var(--surface-glass);
      backdrop-filter: blur(20px);
      border-radius: var(--radius-xl);
      border: 1px solid var(--surface-border);
      box-shadow: var(--shadow-xl);
      pointer-events: auto;
      overflow: hidden;
    }

    .toast::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      border-radius: var(--radius-xl) 0 0 var(--radius-xl);
    }

    .toast-success::before {
      background: var(--color-success);
    }

    .toast-error::before {
      background: var(--color-error);
    }

    .toast-warning::before {
      background: var(--color-warning);
    }

    .toast-info::before {
      background: var(--aurora-blue);
    }

    .toast-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-icon svg {
      width: 20px;
      height: 20px;
    }

    .toast-success .toast-icon {
      color: var(--color-success);
    }

    .toast-error .toast-icon {
      color: var(--color-error);
    }

    .toast-warning .toast-icon {
      color: var(--color-warning);
    }

    .toast-info .toast-icon {
      color: var(--aurora-blue);
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.4;
    }

    .toast-message {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0 0;
      line-height: 1.5;
    }

    .toast-action {
      display: inline-block;
      margin-top: var(--space-2);
      padding: var(--space-1) var(--space-3);
      font-size: var(--text-xs);
      font-weight: 600;
      color: var(--aurora-purple);
      background: transparent;
      border: 1px solid var(--aurora-purple);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .toast-action:hover {
      background: var(--aurora-purple);
      color: white;
    }

    .toast-dismiss {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }

    .toast-dismiss:hover {
      background: var(--surface-glass-hover);
      color: var(--text-secondary);
    }

    .toast-dismiss svg {
      width: 14px;
      height: 14px;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .toast-container {
        left: var(--space-4);
        right: var(--space-4);
        max-width: none;
      }
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
