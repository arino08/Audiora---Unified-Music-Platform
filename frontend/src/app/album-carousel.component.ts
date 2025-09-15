import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService, SpotifyPlayable, YouTubePlayable } from './player.service';

@Component({
  selector: 'audiora-album-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="carousel-wrapper" *ngIf="items().length">
      <div class="carousel" (wheel)="onWheel($event)">
        <div class="album list-item smooth-transition gpu-accelerated hover-lift" *ngFor="let it of items(); let i = index" (click)="play(it)" [title]="it.title" [style.animation-delay.s]="i * 0.08">
          <div class="art liquid-glass glass-glow" [class.placeholder]="!it.image">
            <img *ngIf="it.image" [src]="it.image" alt="art" />
          </div>
          <div class="label truncate">{{ it.title }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .carousel-wrapper { margin-top: 28px; }
    .carousel { display:flex; gap:18px; overflow-x:auto; padding-bottom:4px; scroll-snap-type: x mandatory; scrollbar-width:none; }
    .carousel::-webkit-scrollbar { display:none; }
    .album { width:120px; flex:0 0 auto; display:flex; flex-direction:column; gap:8px; cursor:pointer; scroll-snap-align:start; }
    .album .art { width:100%; aspect-ratio:1; background:rgba(255,255,255,0.05); border-radius:14px; overflow:hidden; position:relative; box-shadow:0 6px 14px -6px rgba(0,0,0,.6); transition: transform .35s var(--transition-base), box-shadow .35s var(--transition-base); }
    .album .art:after { content:""; position:absolute; inset:0; background:linear-gradient(160deg, rgba(255,255,255,.08), rgba(0,0,0,.25)); opacity:0; transition:opacity .35s; }
    .album:hover .art { transform: translateY(-6px) scale(1.04); box-shadow:0 10px 26px -10px rgba(0,0,0,.75); }
    .album:hover .art:after { opacity:1; }
    .album img { width:100%; height:100%; object-fit:cover; }
    .label { font-size:12px; font-weight:500; letter-spacing:.4px; color: var(--color-text-dim); }
    .album:hover .label { color: var(--color-text); }
  `]
})
export class AlbumCarouselComponent {
  @Input() spotify: any[] = [];
  @Input() youtube: any[] = [];
  constructor(private player: PlayerService) {}
  items = computed(() => {
    const mapped: (SpotifyPlayable|YouTubePlayable)[] = [];
    for (const t of this.spotify.slice(0, 12)) {
      mapped.push({ provider:'spotify', uri:t.uri, id:t.id, title:t.name, artists:t.artists||[], album:t.album, durationMs:t.durationMs, image:t.image } as SpotifyPlayable);
    }
    for (const v of this.youtube.slice(0, 12)) {
      mapped.push({ provider:'youtube', videoId:v.videoId, title:v.title, channel:v.channel, image:v.thumbnail } as YouTubePlayable);
    }
    return mapped.slice(0, 18);
  });
  play(item: any){ this.player.play(item, false); }
  onWheel(ev: WheelEvent){
    const el = ev.currentTarget as HTMLElement; if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) { el.scrollLeft += ev.deltaY; ev.preventDefault(); }
  }
}
