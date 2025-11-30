import { Injectable, inject, OnDestroy, signal, computed } from '@angular/core';
import { Subject, takeUntil, interval } from 'rxjs';
import { PlayerService } from './player.service';

export type SleepTimerPreset = 5 | 15 | 30 | 45 | 60 | 90 | 120 | 'end-of-track';

export interface SleepTimerState {
  isActive: boolean;
  remainingMs: number;
  endTime: number | null;
  preset: SleepTimerPreset | null;
  fadeOutEnabled: boolean;
}

const STORAGE_KEY = 'audiora_sleep_timer';
const FADE_OUT_DURATION = 10000; // 10 seconds fade out

@Injectable({
  providedIn: 'root',
})
export class SleepTimerService implements OnDestroy {
  private readonly playerService = inject(PlayerService);
  private readonly destroy$ = new Subject<void>();

  // State
  private readonly _state = signal<SleepTimerState>({
    isActive: false,
    remainingMs: 0,
    endTime: null,
    preset: null,
    fadeOutEnabled: true,
  });

  // Timer interval subscription
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private fadeOutInterval: ReturnType<typeof setInterval> | null = null;
  private originalVolume: number = 1;
  private isFadingOut = false;

  // Public readonly state
  readonly state = computed(() => this._state());
  readonly isActive = computed(() => this._state().isActive);
  readonly remainingMs = computed(() => this._state().remainingMs);
  readonly remainingFormatted = computed(() => {
    const ms = this._state().remainingMs;
    if (ms <= 0) return '0:00';

    const totalSeconds = Math.ceil(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });
  readonly preset = computed(() => this._state().preset);
  readonly fadeOutEnabled = computed(() => this._state().fadeOutEnabled);

  // Events
  readonly timerEnded$ = new Subject<void>();
  readonly timerStarted$ = new Subject<SleepTimerPreset>();
  readonly timerCancelled$ = new Subject<void>();

  // Preset options with labels
  readonly presetOptions: { value: SleepTimerPreset; label: string }[] = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1 hour 30 min' },
    { value: 120, label: '2 hours' },
    { value: 'end-of-track', label: 'End of current track' },
  ];

  constructor() {
    this.loadSettings();
    this.setupTrackEndListener();
  }

  /**
   * Start sleep timer with a preset duration
   */
  startTimer(preset: SleepTimerPreset): void {
    this.cancelTimer(false);

    if (preset === 'end-of-track') {
      this.startEndOfTrackTimer();
    } else {
      this.startDurationTimer(preset);
    }

    this.timerStarted$.next(preset);
  }

  private startDurationTimer(minutes: number): void {
    const durationMs = minutes * 60 * 1000;
    const endTime = Date.now() + durationMs;

    this._state.update((s) => ({
      ...s,
      isActive: true,
      remainingMs: durationMs,
      endTime,
      preset: minutes as SleepTimerPreset,
    }));

    this.startInterval();
    this.saveSettings();
  }

  private startEndOfTrackTimer(): void {
    const duration = this.playerService.duration();
    const position = this.playerService.position();
    const remainingMs = Math.max(0, duration - position);

    this._state.update((s) => ({
      ...s,
      isActive: true,
      remainingMs,
      endTime: Date.now() + remainingMs,
      preset: 'end-of-track',
    }));

    this.startInterval();
  }

  private startInterval(): void {
    // Clear any existing interval
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Update every second
    this.timerInterval = setInterval(() => {
      const state = this._state();

      if (!state.isActive || !state.endTime) {
        return;
      }

      const remaining = state.endTime - Date.now();

      if (remaining <= 0) {
        this.triggerTimerEnd();
      } else if (remaining <= FADE_OUT_DURATION && state.fadeOutEnabled && !this.isFadingOut) {
        // Start fade out
        this.startFadeOut();
        this._state.update((s) => ({ ...s, remainingMs: remaining }));
      } else {
        this._state.update((s) => ({ ...s, remainingMs: remaining }));
      }
    }, 1000);
  }

  private startFadeOut(): void {
    if (this.isFadingOut) return;

    this.isFadingOut = true;
    this.originalVolume = this.playerService.volume();

    const steps = 20; // Number of fade steps
    const stepDuration = FADE_OUT_DURATION / steps;
    const volumeStep = this.originalVolume / steps;
    let currentStep = 0;

    this.fadeOutInterval = setInterval(() => {
      currentStep++;
      const newVolume = Math.max(0, this.originalVolume - volumeStep * currentStep);
      this.playerService.setVolume(newVolume);

      if (currentStep >= steps) {
        if (this.fadeOutInterval) {
          clearInterval(this.fadeOutInterval);
          this.fadeOutInterval = null;
        }
      }
    }, stepDuration);
  }

  private triggerTimerEnd(): void {
    // Stop playback
    this.playerService.pause();

    // Restore volume if we faded out
    if (this.isFadingOut) {
      this.playerService.setVolume(this.originalVolume);
      this.isFadingOut = false;
    }

    // Clear timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.fadeOutInterval) {
      clearInterval(this.fadeOutInterval);
      this.fadeOutInterval = null;
    }

    // Reset state
    this._state.update((s) => ({
      ...s,
      isActive: false,
      remainingMs: 0,
      endTime: null,
      preset: null,
    }));

    this.timerEnded$.next();
    this.clearSettings();
  }

  /**
   * Cancel the current sleep timer
   */
  cancelTimer(emitEvent = true): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.fadeOutInterval) {
      clearInterval(this.fadeOutInterval);
      this.fadeOutInterval = null;
    }

    // Restore volume if we were fading out
    if (this.isFadingOut) {
      this.playerService.setVolume(this.originalVolume);
      this.isFadingOut = false;
    }

    const wasActive = this._state().isActive;

    this._state.update((s) => ({
      ...s,
      isActive: false,
      remainingMs: 0,
      endTime: null,
      preset: null,
    }));

    this.clearSettings();

    if (wasActive && emitEvent) {
      this.timerCancelled$.next();
    }
  }

  /**
   * Add time to the current timer
   */
  addTime(minutes: number): void {
    const state = this._state();
    if (!state.isActive || state.preset === 'end-of-track') return;

    const additionalMs = minutes * 60 * 1000;
    const newEndTime = (state.endTime || Date.now()) + additionalMs;
    const newRemaining = state.remainingMs + additionalMs;

    this._state.update((s) => ({
      ...s,
      remainingMs: newRemaining,
      endTime: newEndTime,
    }));

    // Cancel fade out if we have enough time now
    if (newRemaining > FADE_OUT_DURATION && this.isFadingOut) {
      if (this.fadeOutInterval) {
        clearInterval(this.fadeOutInterval);
        this.fadeOutInterval = null;
      }
      this.playerService.setVolume(this.originalVolume);
      this.isFadingOut = false;
    }

    this.saveSettings();
  }

  /**
   * Enable or disable fade out
   */
  setFadeOutEnabled(enabled: boolean): void {
    this._state.update((s) => ({ ...s, fadeOutEnabled: enabled }));
    localStorage.setItem('audiora_sleep_fade_out', String(enabled));
  }

  /**
   * Listen for track end when using "end of track" preset
   */
  private setupTrackEndListener(): void {
    this.playerService.trackChanged$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const state = this._state();

      if (state.isActive && state.preset === 'end-of-track') {
        // Track changed, timer should have ended but let's make sure
        this.triggerTimerEnd();
      }
    });
  }

  /**
   * Save timer state to localStorage (for page refresh persistence)
   */
  private saveSettings(): void {
    const state = this._state();
    if (state.isActive && state.endTime && state.preset !== 'end-of-track') {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          endTime: state.endTime,
          preset: state.preset,
        })
      );
    }
  }

  /**
   * Load timer state from localStorage
   */
  private loadSettings(): void {
    // Load fade out preference
    const fadeOutPref = localStorage.getItem('audiora_sleep_fade_out');
    if (fadeOutPref !== null) {
      this._state.update((s) => ({ ...s, fadeOutEnabled: fadeOutPref === 'true' }));
    }

    // Load active timer
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { endTime, preset } = JSON.parse(saved);
        const remaining = endTime - Date.now();

        if (remaining > 0) {
          this._state.update((s) => ({
            ...s,
            isActive: true,
            remainingMs: remaining,
            endTime,
            preset,
          }));
          this.startInterval();
        } else {
          // Timer has already ended
          this.clearSettings();
        }
      } catch {
        this.clearSettings();
      }
    }
  }

  private clearSettings(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  ngOnDestroy(): void {
    this.cancelTimer(false);
    this.destroy$.next();
    this.destroy$.complete();
    this.timerEnded$.complete();
    this.timerStarted$.complete();
    this.timerCancelled$.complete();
  }
}
