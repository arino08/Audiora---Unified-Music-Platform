import { Injectable, signal } from '@angular/core';

declare global {
  interface Window { Spotify: any; }
}

@Injectable({ providedIn: 'root' })
export class SpotifyWebSdkService {
  private scriptLoaded = false;
  private player: any;
  deviceId = signal<string | null>(null);
  ready = signal<boolean>(false);
  error = signal<string | null>(null);

  async load(accessTokenProvider: () => Promise<string>): Promise<void> {
    if (this.ready()) return;
    if (!this.scriptLoaded) {
      await this.injectScript();
      this.scriptLoaded = true;
    }
    await this.initPlayer(accessTokenProvider);
  }

  private injectScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-spotify-sdk]');
      if (existing) { resolve(); return; }
      const s = document.createElement('script');
      s.src = 'https://sdk.scdn.co/spotify-player.js';
      s.async = true; s.defer = true; s.setAttribute('data-spotify-sdk','1');
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  private async initPlayer(accessTokenProvider: () => Promise<string>) {
    await this.waitForGlobal();
    const tokenCb = async (cb: (t:string)=>void) => { try { cb(await accessTokenProvider()); } catch (e:any){ this.error.set('token_fetch_failed'); }};
    this.player = new window.Spotify.Player({ name: 'Audiora Web Player', getOAuthToken: tokenCb, volume: 0.8 });
    this.player.addListener('ready', ({ device_id }: any) => { this.deviceId.set(device_id); this.ready.set(true); });
    this.player.addListener('not_ready', ({ device_id }: any) => { if (this.deviceId() === device_id) this.ready.set(false); });
    this.player.addListener('initialization_error', ({ message }: any) => this.error.set(message));
    this.player.addListener('authentication_error', ({ message }: any) => this.error.set(message));
    this.player.addListener('account_error', ({ message }: any) => this.error.set(message));
    this.player.addListener('playback_error', ({ message }: any) => this.error.set(message));
    await this.player.connect();
  }

  private waitForGlobal(): Promise<void> {
    return new Promise(resolve => {
      if (window.Spotify && window.Spotify.Player) { resolve(); return; }
      const iv = setInterval(() => {
        if (window.Spotify && window.Spotify.Player) { clearInterval(iv); resolve(); }
      }, 50);
    });
  }

  async togglePlay() { if (this.player) { await this.player.togglePlay(); } }
  async pause() { if (this.player) { await this.player.pause(); } }
  async resume() { if (this.player) { await this.player.resume(); } }
  async seek(ms: number) { if (this.player) { await this.player.seek(ms); } }
  async getState(): Promise<any> { return this.player ? this.player.getCurrentState() : null; }
}
