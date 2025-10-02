import { Component, computed, signal } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { PlayerService, SpotifyPlayable, YouTubePlayable } from './player.service';
import { SpotifyWebSdkService } from './spotify-web-sdk.service';
import { YouTubePlayerService } from './youtube-player.service';
import { LikedSongsService } from './liked-songs.service';

@Component({
  selector: 'audiora-bottom-player',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('trackChange', [
      transition(':enter', [
        style({ opacity:0, transform:'translateY(6px)' }),
        animate('240ms cubic-bezier(.4,0,.2,1)', style({ opacity:1, transform:'translateY(0)' }))
      ]),
      transition(':increment', [
        style({ opacity:0, transform:'translateY(6px)' }),
        animate('240ms cubic-bezier(.4,0,.2,1)', style({ opacity:1, transform:'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="bottom-player aurora" *ngIf="current() as cur" [class.playing]="playing()">
      <div class="player-backdrop" [style.background-image]="cur.image ? 'url(' + cur.image + ')' : ''"></div>
      <div class="player-shell">
        <div class="primary-row">
          <div class="meta-cluster">
            <div class="art-stack" [@trackChange]="cur.title">
              <div class="art-frame" [class.placeholder]="!cur.image">
                <img *ngIf="cur.image" [src]="cur.image" alt="art" />
                <div *ngIf="!cur.image" class="art-icon">♪</div>
              </div>
              <div class="art-ring" *ngIf="playing()"></div>
            </div>
            <div class="meta-copy">
              <div class="meta-header">
                <div class="title truncate" [@trackChange]="cur.title">{{ cur.title }}</div>
                <span class="provider-pill" [class.spotify]="isSpotify(cur)" [class.youtube]="!isSpotify(cur)">{{ displayProvider(cur) }}</span>
              </div>
              <div class="meta-footer" [@trackChange]="spotifyArtists(cur).join(',') || displayProvider(cur)">
                <ng-container *ngIf="isSpotify(cur) && spotifyArtists(cur).length; else providerOnly">
                  <span class="artists truncate">{{ spotifyArtists(cur).join(', ') }}</span>
                </ng-container>
                <ng-template #providerOnly>
                  <span class="artists truncate">{{ displayProvider(cur) }}</span>
                </ng-template>
              </div>
            </div>
            <button type="button" class="like-chip" [class.liked]="isLiked(cur)" (click)="toggleLike(cur)" title="Toggle like">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <div class="transport-cluster">
            <button type="button" class="t-btn ghost" (click)="previous()" title="Previous" [disabled]="!canGoBack()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="19,20 9,12 19,4"></polygon>
                <line x1="5" y1="19" x2="5" y2="5"></line>
              </svg>
            </button>
            <button type="button" class="t-btn primary" (click)="togglePlay()" title="Play/Pause" [class.pulsing]="playing()">
              <svg *ngIf="!playing()" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"></polygon>
              </svg>
              <svg *ngIf="playing()" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
              <span class="pulse-ring" *ngIf="playing()"></span>
            </button>
            <button type="button" class="t-btn ghost" (click)="next()" title="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5,4 15,12 5,20"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>
            <button type="button" class="t-btn ghost" (click)="forward()" title="Forward" [disabled]="!canGoForward()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="13 5 19 5 19 11"></polyline>
                <path d="M19 5a7 7 0 1 0 2 5.3"></path>
                <polyline points="5 13 9 17 13 13"></polyline>
              </svg>
            </button>
          </div>
        </div>
        <div class="timeline-shell">
          <span class="time">{{ positionLabel() }}</span>
          <div class="timeline-track" (click)="scrub($event)" (mousemove)="preview($event)" (mouseleave)="hovering=false">
            <div class="track-fill" [style.width.%]="progressPercent()"></div>
            <div class="track-handle" [style.left.%]="progressPercent()"></div>
            <div class="track-preview" *ngIf="hovering" [style.left.%]="hoverPercent"></div>
          </div>
          <span class="time">{{ durationLabel() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
  :host {
    position: fixed;
    left: 0;
    right: 0;
    bottom: calc(env(safe-area-inset-bottom, 0px) + clamp(16px, 4vw, 40px));
    display: flex;
    justify-content: center;
    padding: 0 clamp(16px, 5vw, 72px);
    pointer-events: none;
    z-index: 120;
  }

  .bottom-player.aurora {
    position: relative;
    padding: 18px 22px 16px;
    width: min(720px, calc(100% - 32px));
    pointer-events: auto;
    border-top: 1px solid rgba(255,255,255,0.08);
    background: linear-gradient(135deg, rgba(18,24,37,0.94), rgba(8,12,22,0.96));
    backdrop-filter: blur(26px) saturate(185%);
    overflow: hidden;
    border-radius: 20px 20px 16px 16px;
    box-shadow: 0 -14px 34px -18px rgba(0,0,0,0.6);
    z-index: 100;
    box-sizing: border-box;
  }

  .bottom-player.aurora::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 10% -20%, rgba(102,126,234,0.22), transparent 55%), radial-gradient(circle at 90% 120%, rgba(118,75,162,0.26), transparent 60%);
    opacity: 0.7;
    pointer-events: none;
    z-index: 0;
  }

  .player-backdrop {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(46px) saturate(160%);
    opacity: 0.14;
    transform: scale(1.08);
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  .bottom-player.aurora:not(.playing) .player-backdrop {
    opacity: 0.08;
  }

  .player-shell {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .primary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    flex-wrap: wrap;
  }

  .meta-cluster {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 18px;
    min-width: 0;
    flex: 1 1 320px;
  }

  .art-stack {
    position: relative;
    width: 64px;
    height: 64px;
  }

  .art-frame {
    width: 100%;
    height: 100%;
    border-radius: 18px;
    overflow: hidden;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 14px 28px -18px rgba(0,0,0,0.65);
  }

  .art-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .art-frame.placeholder {
    background: linear-gradient(135deg, rgba(102,126,234,0.25), rgba(118,75,162,0.25));
    color: rgba(255,255,255,0.82);
    font-size: 24px;
    font-weight: 600;
  }

  .art-icon {
    font-size: 24px;
    font-weight: 600;
  }

  .art-ring {
    position: absolute;
    inset: -12px;
    border-radius: 26px;
    background: conic-gradient(from 120deg, rgba(102,126,234,0.4), rgba(118,75,162,0.05), rgba(102,126,234,0.4));
    filter: blur(14px);
    opacity: 0.65;
    animation: ringPulse 4s ease-in-out infinite;
    pointer-events: none;
  }

  .meta-copy {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  .meta-header {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text, #fff);
    flex: 1;
  }

  .provider-pill {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.85);
  }

  .provider-pill.spotify {
    border-color: rgba(29,185,84,0.4);
    background: rgba(29,185,84,0.16);
    color: #6ce8a0;
  }

  .provider-pill.youtube {
    border-color: rgba(255,0,0,0.4);
    background: rgba(255,0,0,0.16);
    color: #ff7a7a;
  }

  .meta-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .meta-cluster .like-chip {
    justify-self: end;
  }

  .artists {
    font-size: 13px;
    color: var(--color-text-dim, rgba(255,255,255,0.68));
    flex: 1;
  }

  .like-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.04);
    color: var(--color-text-dim, rgba(255,255,255,0.6));
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .like-chip:hover {
    border-color: rgba(255,255,255,0.28);
    color: var(--color-text, #fff);
    transform: translateY(-1px);
  }

  .like-chip svg {
    width: 24px;
    height: 24px;
  }

  .like-chip.liked {
    border-color: rgba(255,89,142,0.4);
    background: radial-gradient(circle at 50% 0%, rgba(255,89,142,0.32), rgba(255,89,142,0.08));
    color: #ff7aa2;
  }

  .transport-cluster {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    padding: 10px 16px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
    flex: 0 0 auto;
  }

  .t-btn {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.16);
    background: rgba(255,255,255,0.06);
    color: var(--color-text, #fff);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .t-btn svg {
    width: 20px;
    height: 20px;
  }

  .t-btn:hover {
    border-color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.12);
    transform: translateY(-1px);
  }

  .t-btn:disabled,
  .t-btn[disabled] {
    opacity: 0.45;
    cursor: not-allowed;
    border-color: rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    transform: none;
  }

  .t-btn:disabled:hover,
  .t-btn[disabled]:hover {
    border-color: rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
  }

  .t-btn.primary {
    width: 58px;
    height: 58px;
    border: none;
    background: linear-gradient(135deg, #667eea, #764ba2);
    box-shadow: 0 18px 38px -18px rgba(118,75,162,0.75);
  }

  .t-btn.primary svg {
    width: 26px;
    height: 26px;
  }

  .t-btn.primary .pulse-ring {
    position: absolute;
    inset: -8px;
    border-radius: inherit;
    border: 2px solid rgba(255,255,255,0.25);
    opacity: 0.4;
    animation: breathe 2.6s ease-in-out infinite;
    pointer-events: none;
  }

  .t-btn.primary.pulsing {
    animation: popBeat 1.8s ease-in-out infinite;
  }

  .timeline-shell {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 12px 18px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.035);
    backdrop-filter: blur(12px);
  }

  .timeline-shell .time {
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-dim, rgba(255,255,255,0.68));
    text-align: center;
    min-width: 48px;
  }

  .timeline-track {
    position: relative;
    height: 8px;
    border-radius: 999px;
    background: rgba(255,255,255,0.12);
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.2s ease, background 0.2s ease;
  }

  .timeline-track:hover {
    background: rgba(255,255,255,0.18);
    box-shadow: 0 4px 16px -8px rgba(102,126,234,0.55);
  }

  .track-fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: linear-gradient(135deg, rgba(102,126,234,0.92), rgba(118,75,162,0.92));
    border-radius: inherit;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 6px 14px -8px rgba(102,126,234,0.65);
  }

  .track-handle {
    position: absolute;
    top: 50%;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    transform: translate(-50%, -50%);
    box-shadow: 0 6px 16px -6px rgba(0,0,0,0.55);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .timeline-shell:hover .track-handle {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 8px 22px -8px rgba(0,0,0,0.55);
  }

  .track-preview {
    position: absolute;
    top: -5px;
    width: 2px;
    height: 18px;
    background: rgba(255,255,255,0.92);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(255,255,255,0.65);
    pointer-events: none;
  }

  .truncate {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media (max-width: 900px) {
    .primary-row {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }

    .meta-cluster {
      grid-template-columns: auto minmax(0, 1fr);
      gap: 16px;
    }

    .meta-cluster .like-chip {
      justify-self: flex-end;
    }

    .transport-cluster {
      width: 100%;
      justify-content: center;
    }

    .timeline-shell {
      padding: 10px 14px;
      gap: 12px;
    }
  }

  @media (max-width: 600px) {
    .art-stack {
      width: 56px;
      height: 56px;
    }

    .bottom-player.aurora {
      padding: 16px 16px 14px;
    }

    .timeline-shell .time {
      min-width: 44px;
    }
  }

  @media (max-width: 720px) {
    :host {
      padding: 0 clamp(12px, 4vw, 24px);
    }
    .bottom-player.aurora {
      width: 100%;
      padding: 16px;
    }
    .meta-cluster {
      grid-template-columns: auto minmax(0, 1fr);
      gap: 14px;
    }
    .transport-cluster {
      width: 100%;
      justify-content: space-between;
    }
  }

  @media (max-width: 480px) {
    :host {
      padding: 0 clamp(10px, 5vw, 18px);
    }
    .bottom-player.aurora {
      border-radius: 18px;
      padding: 14px 14px 12px;
    }
    .meta-cluster {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto auto auto;
      gap: 12px;
    }
    .meta-cluster .like-chip {
      justify-self: flex-start;
    }
    .transport-cluster {
      gap: 12px;
      padding: 10px 12px;
      flex-wrap: wrap;
    }
    .t-btn {
      width: 38px;
      height: 38px;
    }
    .t-btn.primary {
      width: 52px;
      height: 52px;
    }
    .t-btn.primary svg {
      width: 22px;
      height: 22px;
    }
    .timeline-shell {
      grid-template-columns: 1fr;
      gap: 10px;
      text-align: left;
    }
    .timeline-shell .time {
      min-width: 0;
      text-align: left;
    }
    .timeline-shell .time:last-child {
      justify-self: end;
      text-align: right;
    }
  }

  @keyframes ringPulse {
    0% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 0.75; }
    100% { transform: scale(0.95); opacity: 0.5; }
  }

  @keyframes breathe {
    0%, 100% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }

  @keyframes popBeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  `]
})
export class BottomPlayerComponent {
  current = computed(() => this.player.current());
  playing = computed(() => this.player.isPlaying());
  positionMs = signal(0);
  durationMs = signal(0);
  volume = signal(80);
  canGoBack = computed(() => this.player.history().length > 0);
  canGoForward = computed(() => this.player.future().length > 0);
  private volumeDebounce?: any;
  private poll?: any;
  hovering = false;
  hoverPercent = 0;

  constructor(private player: PlayerService, private spotify: SpotifyWebSdkService, private yt: YouTubePlayerService, private likedSongs: LikedSongsService) {
    this.startPolling();
  }

  // Universal like functionality
  isLiked(track: any): boolean {
    if (!track) return false;
    const provider = track.provider || (track.uri ? 'spotify' : 'youtube');
    const trackId = provider === 'spotify' ? track.id : (track.videoId || track.id);
    return this.likedSongs.isLiked(trackId, provider);
  }

  async toggleLike(track: any): Promise<void> {
    if (!track) return;
    const provider = track.provider || (track.uri ? 'spotify' : 'youtube');
    const isNowLiked = await this.likedSongs.toggleLikeServer(track, provider);
    console.log(`${isNowLiked ? 'Liked' : 'Unliked'}:`, track.title);
  }

  toggleMute(): void {
    if (this.volume() > 0) {
      this.volume.set(0);
    } else {
      this.volume.set(80);
    }
    this.applyVolume();
  }
  private startPolling() {
    this.poll = setInterval(() => this.tick(), 1000);
  }
  private async tick() {
    const cur = this.player.current();
    if (!cur) { this.positionMs.set(0); this.durationMs.set(0); return; }
    if (cur.provider === 'spotify') {
      const st = await this.spotify.getState();
      if (st) { this.positionMs.set(st.position || 0); this.durationMs.set(st.duration || (cur as any).durationMs || 0); }
    } else if (cur.provider === 'youtube') {
      const pos = this.yt.getPositionSeconds()*1000; const dur = this.yt.getDurationSeconds()*1000;
      if (!isNaN(pos)) this.positionMs.set(pos);
      if (!isNaN(dur)) this.durationMs.set(dur);
    }
  }

  progressPercent() { const d = this.durationMs(); return d>0 ? (this.positionMs()/d)*100 : 0; }
  positionLabel() { return this.format(this.positionMs()); }
  durationLabel() { return this.format(this.durationMs()); }
  private format(ms:number){ const t=Math.floor(ms/1000); const m=Math.floor(t/60); const s=t%60; return m+':'+s.toString().padStart(2,'0'); }

  togglePlay(){ if (this.playing()) { this.player.pause(); } else if (this.current()) { this.player.play(this.current()!, false); } }
  next(){ this.player.next(); }
  async previous(){ await this.player.previous(); }
  async forward(){ await this.player.forward(); }
  // TODO: implement previous track once playback history is tracked in PlayerService.

  scrub(ev:MouseEvent){
    if(!this.current()) return;
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (ev.clientX - rect.left)/rect.width));
    const target = pct * this.durationMs();
    this.positionMs.set(target);
    const cur = this.current();
    if(cur?.provider==='spotify') { this.spotify.seek(target); }
    else if(cur?.provider==='youtube'){ this.yt.seek(Math.floor(target/1000)); }
  }
  preview(ev:MouseEvent){
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (ev.clientX - rect.left)/rect.width));
    this.hovering = true; this.hoverPercent = pct*100;
  }

  onVolumeInput(ev: Event){
    const val = Number((ev.target as HTMLInputElement).value);
    this.volume.set(val);
    // live feedback but debounced commit for providers
    if(this.volumeDebounce) clearTimeout(this.volumeDebounce);
    this.volumeDebounce = setTimeout(()=> this.applyVolume(), 120);
  }
  commitVolume(){ this.applyVolume(); }
  private applyVolume(){
    const v = this.volume();
    const cur = this.current();
    if(!cur) return;
    // Spotify SDK volume: 0..1
    if(cur.provider==='spotify') {
      this.spotify.setVolume(Math.min(1, Math.max(0, v/100)));
    } else if(cur.provider==='youtube') {
      this.yt.setVolume(v);
    }
  }

  displayProvider(cur:any){ return cur.provider==='spotify' ? 'Spotify' : 'YouTube'; }
  isSpotify(p:any): p is SpotifyPlayable { return p?.provider==='spotify'; }
  spotifyArtists(p:any){ return Array.isArray(p?.artists)? p.artists: []; }
}
