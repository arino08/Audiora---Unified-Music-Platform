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
    <div class="bottom-player liquid-glass-enhanced" *ngIf="current() as cur" [class.playing]="playing()">
      <div class="bp-left">
        <div class="art-container liquid-morph" [@trackChange]="cur.title">
          <div class="art glass-glow" [class.placeholder]="!cur.image">
            <img *ngIf="cur.image" [src]="cur.image" alt="art" />
            <div *ngIf="!cur.image" class="art-placeholder">♪</div>
          </div>
          <div class="art-glow" *ngIf="cur.image && playing()"></div>
        </div>
        <div class="meta">
          <div class="title truncate" [@trackChange]="cur.title">{{ cur.title }}</div>
          <div class="sub muted truncate" [@trackChange]="spotifyArtists(cur).join(',') || displayProvider(cur)">
            <ng-container *ngIf="isSpotify(cur) && spotifyArtists(cur).length; else providerOnly">{{ spotifyArtists(cur).join(', ') }}</ng-container>
            <ng-template #providerOnly>{{ displayProvider(cur) }}</ng-template>
          </div>
        </div>
        <button class="like-btn liquid-glass glass-ripple" [class.liked]="isLiked(cur)" (click)="toggleLike(cur)" title="Like">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div class="bp-center">
        <div class="transport">
          <button class="t-btn liquid-glass" (click)="previous()" title="Previous">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="19,20 9,12 19,4"></polygon>
              <line x1="5" y1="19" x2="5" y2="5"></line>
            </svg>
          </button>
          <button class="t-btn primary liquid-glass-enhanced glass-glow" (click)="togglePlay()" title="Play/Pause" [class.pulsing]="playing()">
            <svg *ngIf="!playing()" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"></polygon>
            </svg>
            <svg *ngIf="playing()" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>
          <button class="t-btn liquid-glass" (click)="next()" title="Next">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5,4 15,12 5,20"></polygon>
              <line x1="19" y1="5" x2="19" y2="19"></line>
            </svg>
          </button>
        </div>
        <div class="progress-stack">
          <span class="time">{{ positionLabel() }}</span>
          <div class="progress-container" (click)="scrub($event)" (mousemove)="preview($event)" (mouseleave)="hovering=false">
            <div class="progress-line">
              <div class="fill" [style.width.%]="progressPercent()"></div>
              <div class="progress-thumb" [style.left.%]="progressPercent()"></div>
              <div class="hover" *ngIf="hovering" [style.left.%]="hoverPercent"></div>
            </div>
          </div>
          <span class="time">{{ durationLabel() }}</span>
        </div>
      </div>
      <div class="bp-right">
        <div class="volume-container">
          <button class="volume-btn liquid-glass" (click)="toggleMute()" title="Volume">
            <svg *ngIf="volume() > 50" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <svg *ngIf="volume() <= 50 && volume() > 0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <svg *ngIf="volume() === 0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          </button>
          <div class="volume-slider" [class.visible]="showVolumeSlider()">
            <input type="range" min="0" max="100" [value]="volume()" (input)="onVolumeInput($event)" (change)="commitVolume()" />
          </div>
        </div>
        <button class="queue-btn liquid-glass" title="Queue">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
  .bottom-player {
    display: grid;
    grid-template-columns: 520px 800px 440px;
    width: 100%;
    align-items: center;
    gap: 32px;
    height: 90px;
    backdrop-filter: blur(40px) saturate(180%);
    background: linear-gradient(135deg, rgba(20,26,34,.85), rgba(12,16,22,.90));
    border-top: 1px solid rgba(255,255,255,.08);
    position: relative;
    overflow: hidden;
    z-index: var(--z-content);
  }

  .bottom-player:before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 50%, rgba(36,134,255,.12), transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .bottom-player > * {
    position: relative;
    z-index: 1;
  }

  .bp-left {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .art-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .art {
    width: 64px;
    height: 64px;
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,.08);
    position: relative;
    z-index: 2;
  }

  .art img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .art-placeholder {
    font-size: 24px;
    color: var(--color-text-dim);
    font-weight: 600;
  }

  .art-glow {
    position: absolute;
    inset: -8px;
    background: var(--gradient-accent);
    border-radius: 20px;
    filter: blur(16px);
    opacity: 0.4;
    z-index: 1;
    animation: art-pulse 3s ease-in-out infinite alternate;
  }

  @keyframes art-pulse {
    0% { transform: scale(0.95); opacity: 0.3; }
    100% { transform: scale(1.05); opacity: 0.5; }
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    flex: 1;
  }

  .title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
  }

  .like-btn {
    background: none;
    border: none;
    color: var(--color-text-dim);
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .like-btn:hover {
    color: var(--color-accent);
    background: rgba(36,134,255,.1);
    transform: scale(1.1);
  }

  .like-btn.liked {
    color: var(--color-accent);
  }

  .like-btn.liked svg {
    fill: currentColor;
  }

  .transport {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
    margin-bottom: 12px;
  }

  .t-btn {
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.12);
    color: var(--color-text);
    border-radius: 50%;
    cursor: pointer;
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }

  .t-btn.primary {
    width: 48px;
    height: 48px;
    background: var(--gradient-accent);
    border: none;
    color: white;
    position: relative;
    overflow: hidden;
  }

    .t-btn.primary.pulsing {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .t-btn.pulsing:before {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: inherit;
    box-shadow: 0 0 0 0 rgba(36,134,255,.6);
    animation: pulse 2.2s ease-in-out infinite;
  }

  .t-btn:hover {
    background: rgba(255,255,255,.15);
    border-color: rgba(255,255,255,.25);
    transform: translateY(-1px);
  }

  .t-btn.primary:hover {
    filter: brightness(1.1);
    background: var(--gradient-accent);
  }

  .progress-stack {
    flex: 1;
    display: grid;
    grid-template-columns: 50px 1fr 50px;
    align-items: center;
    gap: 16px;
  }

  .progress-container {
    position: relative;
    cursor: pointer;
    padding: 8px 0;
  }

  .progress-line {
    position: relative;
    height: 6px;
    background: rgba(255,255,255,.12);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-line .fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: var(--gradient-accent);
    border-radius: inherit;
    box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 2px 6px -2px rgba(0,0,0,.6);
    transition: box-shadow var(--transition-base);
  }

  .progress-container:hover .progress-line .fill {
    box-shadow: 0 0 0 1px rgba(255,255,255,.12), 0 4px 12px -2px rgba(36,134,255,.4);
  }

  .progress-thumb {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 8px -2px rgba(0,0,0,.5);
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  .progress-container:hover .progress-thumb {
    opacity: 1;
  }

  .bottom-player.playing .progress-line .fill:after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.4) 45%, transparent 60%);
    animation: shimmer 6s linear infinite;
    mix-blend-mode: overlay;
  }

  .progress-line .hover {
    position: absolute;
    top: -4px;
    width: 2px;
    height: 14px;
    background: var(--color-accent);
    opacity: .9;
    pointer-events: none;
    box-shadow: 0 0 8px 2px rgba(36,134,255,.6);
    border-radius: 1px;
  }

  .time {
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-dim);
    text-align: center;
  }

  .bp-center {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bp-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
  }

  .volume-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .volume-btn {
    background: none;
    border: none;
    color: var(--color-text-dim);
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .volume-btn:hover {
    color: var(--color-text);
    background: rgba(255,255,255,.08);
  }

  .volume-slider {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(20,26,34,.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: var(--radius-lg);
    padding: 16px 8px;
    margin-bottom: 8px;
    opacity: 0;
    pointer-events: none;
    transition: all var(--transition-base);
  }

  .volume-slider.visible {
    opacity: 1;
    pointer-events: all;
  }

  .volume-slider input[type=range] {
    width: 80px;
    height: 4px;
    writing-mode: bt-lr;
    -webkit-appearance: slider-vertical;
    accent-color: var(--color-accent);
    cursor: pointer;
    background: transparent;
  }

  .queue-btn {
    background: none;
    border: none;
    color: var(--color-text-dim);
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: all var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .queue-btn:hover {
    color: var(--color-text);
    background: rgba(255,255,255,.08);
  }

  @media (max-width: 980px) {
    .bottom-player {
      grid-template-columns: 1fr;
      gap: 16px;
      height: auto;
      padding: 16px;
    }
    .bp-center { order: 3; }
    .bp-right { order: 2; justify-content: center; }
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(36,134,255,.6); }
    70% { box-shadow: 0 0 0 16px rgba(36,134,255,0); }
    100% { box-shadow: 0 0 0 0 rgba(36,134,255,0); }
  }

  @keyframes shimmer {
    0% { transform: translateX(-60%); }
    100% { transform: translateX(60%); }
  }
  `]
})
export class BottomPlayerComponent {
  current = computed(() => this.player.current());
  playing = computed(() => this.player.isPlaying());
  positionMs = signal(0);
  durationMs = signal(0);
  volume = signal(80);
  showVolumeSlider = signal(false);
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
  previous(){ /* placeholder for future previous logic */ }
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
