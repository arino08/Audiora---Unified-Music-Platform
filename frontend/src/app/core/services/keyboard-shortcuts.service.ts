import { Injectable, inject, OnDestroy } from '@angular/core';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { PlayerService } from './player.service';
import { Router } from '@angular/router';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
  category: 'playback' | 'navigation' | 'volume' | 'other';
}

@Injectable({
  providedIn: 'root',
})
export class KeyboardShortcutsService implements OnDestroy {
  private readonly playerService = inject(PlayerService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  private enabled = true;
  private shortcuts: KeyboardShortcut[] = [];

  // Event emitters for actions that need component handling
  readonly toggleQueue$ = new Subject<void>();
  readonly toggleLike$ = new Subject<void>();
  readonly focusSearch$ = new Subject<void>();
  readonly showShortcuts$ = new Subject<void>();

  constructor() {
    this.registerDefaultShortcuts();
    this.setupKeyboardListener();
  }

  private registerDefaultShortcuts(): void {
    this.shortcuts = [
      // Playback controls
      {
        key: ' ',
        description: 'Play / Pause',
        category: 'playback',
        action: () => this.playerService.togglePlayPause(),
      },
      {
        key: 'k',
        description: 'Play / Pause (alternative)',
        category: 'playback',
        action: () => this.playerService.togglePlayPause(),
      },
      {
        key: 'ArrowRight',
        description: 'Seek forward 5 seconds',
        category: 'playback',
        action: () => this.seekRelative(5000),
      },
      {
        key: 'ArrowLeft',
        description: 'Seek backward 5 seconds',
        category: 'playback',
        action: () => this.seekRelative(-5000),
      },
      {
        key: 'ArrowRight',
        shift: true,
        description: 'Seek forward 10 seconds',
        category: 'playback',
        action: () => this.seekRelative(10000),
      },
      {
        key: 'ArrowLeft',
        shift: true,
        description: 'Seek backward 10 seconds',
        category: 'playback',
        action: () => this.seekRelative(-10000),
      },
      {
        key: 'j',
        description: 'Previous track',
        category: 'playback',
        action: () => this.playerService.previous(),
      },
      {
        key: 'l',
        description: 'Next track',
        category: 'playback',
        action: () => this.playerService.next(),
      },
      {
        key: 'n',
        description: 'Next track (alternative)',
        category: 'playback',
        action: () => this.playerService.next(),
      },
      {
        key: 'p',
        description: 'Previous track (alternative)',
        category: 'playback',
        action: () => this.playerService.previous(),
      },
      {
        key: 's',
        description: 'Toggle shuffle',
        category: 'playback',
        action: () => this.playerService.toggleShuffle(),
      },
      {
        key: 'r',
        description: 'Cycle repeat mode',
        category: 'playback',
        action: () => this.playerService.cycleRepeatMode(),
      },

      // Volume controls
      {
        key: 'm',
        description: 'Toggle mute',
        category: 'volume',
        action: () => this.playerService.toggleMute(),
      },
      {
        key: 'ArrowUp',
        description: 'Volume up 5%',
        category: 'volume',
        action: () => this.playerService.volumeUp(),
      },
      {
        key: 'ArrowDown',
        description: 'Volume down 5%',
        category: 'volume',
        action: () => this.playerService.volumeDown(),
      },
      {
        key: 'ArrowUp',
        shift: true,
        description: 'Volume up 10%',
        category: 'volume',
        action: () => this.adjustVolume(0.1),
      },
      {
        key: 'ArrowDown',
        shift: true,
        description: 'Volume down 10%',
        category: 'volume',
        action: () => this.adjustVolume(-0.1),
      },
      {
        key: '0',
        description: 'Mute',
        category: 'volume',
        action: () => this.playerService.setVolume(0),
      },

      // Navigation
      {
        key: '/',
        description: 'Focus search',
        category: 'navigation',
        action: () => this.focusSearch$.next(),
      },
      {
        key: 'k',
        ctrl: true,
        description: 'Focus search (alternative)',
        category: 'navigation',
        action: () => this.focusSearch$.next(),
      },
      {
        key: 'h',
        description: 'Go to Home',
        category: 'navigation',
        action: () => this.router.navigate(['/']),
      },
      {
        key: 'g',
        description: 'Go to Library',
        category: 'navigation',
        action: () => this.router.navigate(['/library']),
      },

      // Other
      {
        key: 'q',
        description: 'Toggle queue panel',
        category: 'other',
        action: () => this.toggleQueue$.next(),
      },
      {
        key: 'f',
        description: 'Toggle like current track',
        category: 'other',
        action: () => this.toggleLike$.next(),
      },
      {
        key: '?',
        description: 'Show keyboard shortcuts',
        category: 'other',
        action: () => this.showShortcuts$.next(),
      },
      {
        key: 'Escape',
        description: 'Close panels / Deselect',
        category: 'other',
        action: () => this.handleEscape(),
      },
    ];
  }

  private setupKeyboardListener(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.handleKeydown(event));
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    const isInputField =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable;

    // Allow certain shortcuts even in input fields
    const allowedInInputs = ['Escape'];

    if (isInputField && !allowedInInputs.includes(event.key)) {
      // Allow Ctrl+K for search even in inputs
      if (!(event.ctrlKey && event.key === 'k')) {
        return;
      }
    }

    // Find matching shortcut
    const shortcut = this.shortcuts.find((s) => {
      const keyMatches = s.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatches = !!s.ctrl === event.ctrlKey;
      const shiftMatches = !!s.shift === event.shiftKey;
      const altMatches = !!s.alt === event.altKey;

      return keyMatches && ctrlMatches && shiftMatches && altMatches;
    });

    if (shortcut) {
      // Prevent default for handled shortcuts
      // Exception: don't prevent default for search (/) unless shift is held
      if (event.key !== '/' || event.shiftKey) {
        event.preventDefault();
      }

      // Special case for '/' - only trigger if not typing
      if (event.key === '/' && !event.shiftKey) {
        event.preventDefault();
      }

      shortcut.action();
    }
  }

  private seekRelative(ms: number): void {
    const currentPosition = this.playerService.position();
    const duration = this.playerService.duration();
    const newPosition = Math.max(0, Math.min(currentPosition + ms, duration));
    this.playerService.seek(newPosition);
  }

  private adjustVolume(delta: number): void {
    const currentVolume = this.playerService.volume();
    const newVolume = Math.max(0, Math.min(1, currentVolume + delta));
    this.playerService.setVolume(newVolume);
  }

  private handleEscape(): void {
    // Close any open panels/modals
    this.toggleQueue$.next(); // Will close if open
    // Blur any focused element
    (document.activeElement as HTMLElement)?.blur();
  }

  /**
   * Enable or disable keyboard shortcuts
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if shortcuts are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get all registered shortcuts
   */
  getShortcuts(): KeyboardShortcut[] {
    return [...this.shortcuts];
  }

  /**
   * Get shortcuts grouped by category
   */
  getShortcutsByCategory(): Record<string, KeyboardShortcut[]> {
    return this.shortcuts.reduce(
      (acc, shortcut) => {
        if (!acc[shortcut.category]) {
          acc[shortcut.category] = [];
        }
        acc[shortcut.category].push(shortcut);
        return acc;
      },
      {} as Record<string, KeyboardShortcut[]>
    );
  }

  /**
   * Format a shortcut key combination for display
   */
  formatShortcut(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];

    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');

    // Format special keys
    let key = shortcut.key;
    switch (key) {
      case ' ':
        key = 'Space';
        break;
      case 'ArrowUp':
        key = '↑';
        break;
      case 'ArrowDown':
        key = '↓';
        break;
      case 'ArrowLeft':
        key = '←';
        break;
      case 'ArrowRight':
        key = '→';
        break;
      case 'Escape':
        key = 'Esc';
        break;
      default:
        key = key.toUpperCase();
    }

    parts.push(key);

    return parts.join(' + ');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.toggleQueue$.complete();
    this.toggleLike$.complete();
    this.focusSearch$.complete();
    this.showShortcuts$.complete();
  }
}
