import { Injectable, signal, computed } from '@angular/core';
import { Toast, ToastAction } from '../models';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  action?: ToastAction;
  dismissible?: boolean;
}

const DEFAULT_DURATION = 5000;
const MAX_TOASTS = 5;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  // Toasts state using signals
  private toastsSignal = signal<Toast[]>([]);

  // Public computed signals
  readonly toasts = computed(() => this.toastsSignal());
  readonly hasToasts = computed(() => this.toastsSignal().length > 0);
  readonly toastCount = computed(() => this.toastsSignal().length);

  // Counter for generating unique IDs
  private idCounter = 0;

  // ============================================================================
  // Public Methods
  // ============================================================================

  /**
   * Show a toast notification
   */
  show(options: ToastOptions): string {
    const toast: Toast = {
      id: this.generateId(),
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration ?? DEFAULT_DURATION,
      action: options.action,
    };

    this.addToast(toast);

    // Auto-dismiss if duration is set
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, toast.duration);
    }

    return toast.id;
  }

  /**
   * Show a success toast
   */
  success(title: string, message?: string, options?: Partial<ToastOptions>): string {
    return this.show({
      ...options,
      title,
      message,
      type: 'success',
    });
  }

  /**
   * Show an error toast
   */
  error(title: string, message?: string, options?: Partial<ToastOptions>): string {
    return this.show({
      ...options,
      title,
      message,
      type: 'error',
      // Errors stay longer by default
      duration: options?.duration ?? 8000,
    });
  }

  /**
   * Show a warning toast
   */
  warning(title: string, message?: string, options?: Partial<ToastOptions>): string {
    return this.show({
      ...options,
      title,
      message,
      type: 'warning',
    });
  }

  /**
   * Show an info toast
   */
  info(title: string, message?: string, options?: Partial<ToastOptions>): string {
    return this.show({
      ...options,
      title,
      message,
      type: 'info',
    });
  }

  /**
   * Show a toast with an action button
   */
  showWithAction(
    title: string,
    actionLabel: string,
    actionCallback: () => void,
    options?: Partial<ToastOptions>
  ): string {
    return this.show({
      ...options,
      title,
      action: {
        label: actionLabel,
        callback: actionCallback,
      },
      // Toasts with actions stay longer
      duration: options?.duration ?? 10000,
    });
  }

  /**
   * Dismiss a toast by ID
   */
  dismiss(id: string): void {
    this.toastsSignal.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  /**
   * Dismiss all toasts
   */
  dismissAll(): void {
    this.toastsSignal.set([]);
  }

  /**
   * Execute toast action and dismiss
   */
  executeAction(id: string): void {
    const toast = this.toastsSignal().find((t) => t.id === id);
    if (toast?.action) {
      toast.action.callback();
      this.dismiss(id);
    }
  }

  // ============================================================================
  // Convenience Methods for Common Scenarios
  // ============================================================================

  /**
   * Show toast for successful save operation
   */
  saved(itemName?: string): string {
    return this.success(
      'Saved',
      itemName ? `${itemName} has been saved successfully.` : 'Changes saved successfully.'
    );
  }

  /**
   * Show toast for successful delete operation
   */
  deleted(itemName?: string): string {
    return this.success(
      'Deleted',
      itemName ? `${itemName} has been deleted.` : 'Item deleted successfully.'
    );
  }

  /**
   * Show toast for successful copy operation
   */
  copied(itemName?: string): string {
    return this.success('Copied', itemName ? `${itemName} copied to clipboard.` : 'Copied to clipboard.');
  }

  /**
   * Show toast for network error
   */
  networkError(): string {
    return this.error(
      'Connection Error',
      'Unable to connect to the server. Please check your internet connection.'
    );
  }

  /**
   * Show toast for unauthorized error
   */
  unauthorized(): string {
    return this.error('Session Expired', 'Your session has expired. Please log in again.');
  }

  /**
   * Show toast for permission denied error
   */
  forbidden(): string {
    return this.error('Access Denied', 'You do not have permission to perform this action.');
  }

  /**
   * Show toast for validation error
   */
  validationError(message?: string): string {
    return this.error('Validation Error', message || 'Please check your input and try again.');
  }

  /**
   * Show toast for added to playlist
   */
  addedToPlaylist(playlistName: string): string {
    return this.success('Added to Playlist', `Track added to "${playlistName}".`);
  }

  /**
   * Show toast for removed from playlist
   */
  removedFromPlaylist(playlistName: string): string {
    return this.success('Removed', `Track removed from "${playlistName}".`);
  }

  /**
   * Show toast for added to queue
   */
  addedToQueue(): string {
    return this.success('Added to Queue', 'Track will play next.');
  }

  /**
   * Show toast for track liked
   */
  trackLiked(): string {
    return this.success('Added to Liked Songs');
  }

  /**
   * Show toast for track unliked
   */
  trackUnliked(): string {
    return this.info('Removed from Liked Songs');
  }

  /**
   * Show toast for playlist created
   */
  playlistCreated(name: string): string {
    return this.success('Playlist Created', `"${name}" has been created.`);
  }

  /**
   * Show toast for provider connected
   */
  providerConnected(providerName: string): string {
    return this.success('Connected', `Successfully connected to ${providerName}.`);
  }

  /**
   * Show toast for provider disconnected
   */
  providerDisconnected(providerName: string): string {
    return this.info('Disconnected', `${providerName} has been disconnected.`);
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private addToast(toast: Toast): void {
    this.toastsSignal.update((toasts) => {
      // Remove oldest toasts if we exceed the max
      const newToasts = [...toasts, toast];
      if (newToasts.length > MAX_TOASTS) {
        return newToasts.slice(newToasts.length - MAX_TOASTS);
      }
      return newToasts;
    });
  }

  private generateId(): string {
    return `toast-${Date.now()}-${++this.idCounter}`;
  }
}
