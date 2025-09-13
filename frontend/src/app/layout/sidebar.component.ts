import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'audiora-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="sidebar-inner">
      <div class="brand">Audiora</div>
      <div class="section">
        <button (click)="connectSpotify.emit()">Connect Spotify</button>
        <button (click)="connectYouTube.emit()">Connect YouTube</button>
      </div>
      <div class="section" *ngIf="sessionId">
        <h4>Library</h4>
        <ul class="menu">
          <li><button (click)="loadSpotifyPlaylists.emit()">Spotify Playlists</button></li>
          <li><button (click)="loadYouTubePlaylists.emit()">YouTube Playlists</button></li>
        </ul>
      </div>
      <div class="section session-meta" *ngIf="sessionId">
        <small>Session</small>
        <code style="display:block;word-break:break-all;opacity:.8">{{ sessionId }}</code>
        <button (click)="clear.emit()" class="danger">Clear Session</button>
      </div>
    </nav>
  `,
  styles: [`
    :host { display:block; }
    nav.sidebar-inner { display:flex; flex-direction:column; gap:16px; padding:16px; height:100%; box-sizing:border-box; }
    .brand { font-size:20px; font-weight:600; letter-spacing:.5px; }
    .section h4 { margin:0 0 4px; font-size:12px; text-transform:uppercase; letter-spacing:1px; opacity:.7; }
    .menu { list-style:none; padding:0; margin:4px 0 0; display:flex; flex-direction:column; gap:4px; }
    button { background: var(--color-surface-2,#2a2a2a); border:1px solid var(--color-border,#333); color: var(--color-text,#fff); padding:6px 10px; border-radius:6px; cursor:pointer; font:inherit; text-align:left; }
    button:hover { background: var(--color-surface-3,#333); }
    button.danger { background:#3a1a1a; border-color:#5a2a2a; }
    button.danger:hover { background:#4a2222; }
    code { font-size:10px; }
  `]
})
export class SidebarComponent {
  @Input() sessionId: string | null = null;
  @Output() connectSpotify = new EventEmitter<void>();
  @Output() connectYouTube = new EventEmitter<void>();
  @Output() loadSpotifyPlaylists = new EventEmitter<void>();
  @Output() loadYouTubePlaylists = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
}
