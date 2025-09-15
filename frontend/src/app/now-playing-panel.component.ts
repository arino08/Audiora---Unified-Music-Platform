import { Component, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService, SpotifyPlayable, YouTubePlayable } from './player.service';
import { SpotifyWebSdkService } from './spotify-web-sdk.service';
import { YouTubePlayerService } from './youtube-player.service';

@Component({
  selector: 'audiora-now-playing-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="now-playing panel" *ngIf="current() as cur">
      <div class="np-header">
        <div class="art" [class.placeholder]="!cur.image">
          <img *ngIf="cur.image" [src]="cur.image" alt="artwork" />
          <span *ngIf="!cur.image">♪</span>
        </div>
        <div class="meta">
          <h3 class="title">{{ cur.title }}</h3>
          <div class="sub" *ngIf="isSpotify(cur)">
            <span class="provider-badge spotify">Spotify</span>
            <span class="artists" *ngIf="spotifyArtists(cur).length">{{ spotifyArtists(cur).join(', ') }}</span>
          </div>
          <div class="sub" *ngIf="isYouTube(cur)">
            <span class="provider-badge youtube">YouTube</span>
            <span class="channel" *ngIf="youtubeChannel(cur)">{{ youtubeChannel(cur) }}</span>
          </div>
        </div>
      </div>
      <div class="progress-block" *ngIf="durationMs() > 0">
        <div class="bar"><div class="fill" [style.width.%]="progressPercent()"></div></div>
        <div class="times">
          <span>{{ positionLabel() }}</span>
          <span>{{ durationLabel() }}</span>
        </div>
      </div>
      <div class="controls-row">
        <button class="btn sm" (click)="togglePlay()">{{ playing() ? 'Pause' : 'Play' }}</button>
        <button class="btn sm" (click)="next()">Next</button>
      </div>
    </div>
    <div *ngIf="!current()" class="panel empty small">Nothing playing</div>
  `,
  styles: [`
    .now-playing { display:flex; flex-direction:column; gap:12px; }
    .np-header { display:flex; gap:12px; }
    .art { width:72px; height:72px; border-radius:8px; background:var(--color-surface-3,#222); display:flex; align-items:center; justify-content:center; font-size:28px; }
    .art img { width:100%; height:100%; object-fit:cover; border-radius:inherit; }
    .meta { flex:1; min-width:0; }
    .title { margin:0 0 4px; font-size:16px; line-height:1.2; }
    .sub { font-size:12px; display:flex; gap:8px; flex-wrap:wrap; opacity:.85; }
    .provider-badge { padding:2px 6px; border-radius:12px; font-size:10px; letter-spacing:.5px; background:#333; text-transform:uppercase; }
    .provider-badge.spotify { background:#1db95422; color:#1db954; }
    .provider-badge.youtube { background:#ff000022; color:#ff5555; }
    .progress-block { display:flex; flex-direction:column; gap:4px; }
    .times { display:flex; justify-content:space-between; font-size:10px; opacity:.7; }
    input.progress { width:100%; cursor:pointer; }
    .controls-row { display:flex; gap:8px; }
    .btn { background: var(--color-surface-2,#2a2a2a); border:1px solid var(--color-border,#333); color: var(--color-text,#fff); padding:6px 12px; border-radius:6px; cursor:pointer; font:inherit; }
    .btn:hover { background: var(--color-surface-3,#333); }
    .btn.sm { padding:4px 10px; font-size:12px; }
  `]
})
export class NowPlayingPanelComponent implements OnDestroy {
  private interval: any;
  positionMs = signal(0);
  durationMs = signal(0);
  playing = computed(() => this.player.isPlaying());
  current = computed(() => this.player.current());

  constructor(private player: PlayerService, private spotifySdk: SpotifyWebSdkService, private yt: YouTubePlayerService) {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void { if (this.interval) clearInterval(this.interval); }

  isSpotify(p: any): p is SpotifyPlayable { return p?.provider === 'spotify'; }
  isYouTube(p: any): p is YouTubePlayable { return p?.provider === 'youtube'; }

  private async tick() {
    const cur = this.player.current();
    if (!cur) { this.positionMs.set(0); this.durationMs.set(0); return; }
    if (cur.provider === 'spotify') {
      const st = await this.spotifySdk.getState();
      if (st) {
        this.positionMs.set(st.position || 0);
        this.durationMs.set(st.duration || (cur as any).durationMs || 0);
      }
    } else if (cur.provider === 'youtube') {
      const pos = this.yt.getPositionSeconds() * 1000;
      const dur = this.yt.getDurationSeconds() * 1000;
      if (!isNaN(pos)) this.positionMs.set(pos);
      if (!isNaN(dur)) this.durationMs.set(dur);
    }
  }

  positionLabel() { return this.formatTime(this.positionMs()); }
  durationLabel() { return this.formatTime(this.durationMs()); }
  private formatTime(ms: number) {
    const total = Math.floor(ms / 1000); const m = Math.floor(total / 60); const s = total % 60; return m + ':' + s.toString().padStart(2,'0');
  }

  spotifyArtists(p: any): string[] { return Array.isArray(p?.artists) ? p.artists : []; }
  youtubeChannel(p: any): string | null { return p?.channel || null; }

  togglePlay() {
    if (this.player.isPlaying()) {
      this.player.pause();
    } else if (this.player.current()) {
      const cur = this.player.current();
      if (cur?.provider === 'spotify') {
        // resume via backend endpoint triggered through AppComponent would be nicer; fallback: replay track
        this.player.play(cur, false);
      } else if (cur?.provider === 'youtube') {
        // resume playback
        this.yt.playVideo((cur as YouTubePlayable).videoId, this.positionMs()/1000);
      }
    }
  }

  next() { this.player.next(); }

  progressPercent() { const d = this.durationMs(); return d > 0 ? (this.positionMs() / d) * 100 : 0; }
}
