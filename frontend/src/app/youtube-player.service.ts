import { Injectable, signal } from '@angular/core';

declare global { interface Window { onYouTubeIframeAPIReady: any; YT: any; } }

@Injectable({ providedIn: 'root' })
export class YouTubePlayerService {
  private player: any;
  apiReady = signal<boolean>(false);
  currentVideoId = signal<string | null>(null);
  endedCallback?: () => void;
  error = signal<string | null>(null);
  playCallback?: () => void;
  pauseCallback?: () => void;

  async load(): Promise<void> {
    if (this.apiReady()) return;
    await this.inject();
    await this.waitReady();
    this.createPlayer();
  }

  private inject(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) { resolve(); return; }
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.onload = () => resolve();
      tag.onerror = e => reject(e);
      document.head.appendChild(tag);
    });
  }

  private waitReady(): Promise<void> {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) { resolve(); return; }
      window.onYouTubeIframeAPIReady = () => { resolve(); };
    });
  }

  private createPlayer() {
    const containerId = 'yt-player-host';
    let host = document.getElementById(containerId);
    if (!host) {
      host = document.createElement('div');
      host.id = containerId;
      host.style.width = '0';
      host.style.height = '0';
      host.style.overflow = 'hidden';
      document.body.appendChild(host);
    }
    this.player = new window.YT.Player(containerId, {
      height: '0', width: '0', videoId: '',
      playerVars: { autoplay: 0, controls: 0 },
      events: {
        onReady: () => { this.apiReady.set(true); },
        onStateChange: (e: any) => {
          if (e.data === window.YT.PlayerState.ENDED && this.endedCallback) {
            this.endedCallback();
          } else if (e.data === window.YT.PlayerState.PLAYING && this.playCallback) {
            this.playCallback();
          } else if (e.data === window.YT.PlayerState.PAUSED && this.pauseCallback) {
            this.pauseCallback();
          }
        },
        onError: (e: any) => { this.error.set('yt_error_' + e.data); }
      }
    });
  }

  onEnded(cb: () => void) { this.endedCallback = cb; }
  onPlay(cb: () => void) { this.playCallback = cb; }
  onPause(cb: () => void) { this.pauseCallback = cb; }

  async playVideo(videoId: string, startSeconds?: number) {
    await this.load();
    if (!this.player) return;
    this.currentVideoId.set(videoId);
    this.player.loadVideoById({ videoId, startSeconds });
  }

  pause() { if (this.player) this.player.pauseVideo(); }
  stop() { if (this.player) this.player.stopVideo(); }
  seek(seconds: number) { if (this.player) this.player.seekTo(seconds, true); }
  getPositionSeconds(): number { return this.player ? this.player.getCurrentTime() : 0; }
  getDurationSeconds(): number { return this.player ? this.player.getDuration() : 0; }
}
