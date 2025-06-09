import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SingleInstanceGuard implements CanActivate {
  private readonly CHANNEL_NAME = 'app_instance_channel';
  private readonly REDIRECT_URL = '/already-open';
  private readonly IS_PRODUCTION = true;

  private tabId = this.generateUniqueTabId();
  private knownMainTabId: string | null = null;
  private channel: BroadcastChannel | null = null;
  private resolveGuard!: (value: boolean) => void;

  constructor() {
    console.log('[Guard] Constructor - tabId:', this.tabId);
  }

  canActivate(): Promise<boolean> {
    console.log('[Guard] canActivate called');
    return new Promise<boolean>((resolve) => {
      this.resolveGuard = resolve;
      this.init();
    });
  }

  private init() {
    if (typeof window === 'undefined') return;

    console.log('[Guard] Init started with tabId:', this.tabId);

    if ('BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(this.CHANNEL_NAME);

      this.channel.onmessage = (event) => {
        const data = event.data;
        console.log('[Guard] Received message:', data);

        if (!data || !data.type) return;

        switch (data.type) {
          case 'ping':
            this.onPing(data.tabId);
            break;
          case 'pong':
            this.onPong(data.tabId);
            break;
        }
      };

      this.channel.postMessage({ type: 'ping', tabId: this.tabId });
      console.log('[Guard] Sent ping:', this.tabId);


      let resolved = false;

      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.log('[Guard] No pong received, this is the main tab');
          this.becomeMainTab();
          this.resolveGuard(true); // allow route
        }
      }, 200);

      // Override onPong to resolve guard if pong received in time
      const originalOnPong = this.onPong.bind(this);
      this.onPong = (tabId: string) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          this.knownMainTabId = tabId;
          console.log('[Guard] Received pong. Main tab is:', tabId);
          if (this.IS_PRODUCTION) {
            window.location.href = this.REDIRECT_URL;
          }
          this.resolveGuard(false);
        }
        originalOnPong(tabId);
      };

    } else {
      // Fallback using localStorage and storage events for old browsers
      console.log('[Guard] BroadcastChannel not supported. Using localStorage fallback.');

      let resolved = false;

      const storageListener = (event: StorageEvent) => {
        if (event.key !== 'app_instance_check' || !event.newValue) return;

        const data = JSON.parse(event.newValue);
        if (!data || !data.type) return;

        console.log('[Guard] Received storage event:', data);

        switch (data.type) {
          case 'ping':
            if (this.knownMainTabId === this.tabId) {
              // Reply pong if this tab is main
              const pong = { type: 'pong', tabId: this.tabId, timestamp: Date.now() };
              localStorage.setItem('app_instance_check', JSON.stringify(pong));
            }
            break;

          case 'pong':
            if (!resolved) {
              resolved = true;
              this.knownMainTabId = data.tabId;
              console.log('[Guard] Received pong via storage. Main tab is:', data.tabId);
              if (this.IS_PRODUCTION) {
                window.location.href = this.REDIRECT_URL;
              }
              this.resolveGuard(false);
              window.removeEventListener('storage', storageListener);
            }
            break;
        }
      };

      (window as Window).addEventListener('storage', storageListener);

      // Send ping
      const ping = { type: 'ping', tabId: this.tabId, timestamp: Date.now() };
      localStorage.setItem('app_instance_check', JSON.stringify(ping));

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.log('[Guard] No pong received via storage, this is the main tab');
          this.becomeMainTab();
          this.resolveGuard(true);
          window.removeEventListener('storage', storageListener);
        }
      }, 500);
    }
  }

  private becomeMainTab() {
    this.knownMainTabId = this.tabId;
    console.log('[Guard] Tab becomes main:', this.tabId);
  }

  private onPing(tabId: string) {
    console.log('[Guard] Received ping from tab:', tabId);
    if (this.knownMainTabId === this.tabId) {
      this.channel?.postMessage({ type: 'pong', tabId: this.tabId });
      console.log('[Guard] Sent pong from main tab');
    }
  }

  private onPong(tabId: string) {
    this.knownMainTabId = tabId;
    console.log('[Guard] Received pong. Main tab is:', tabId);
  }

  private generateUniqueTabId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 10)}`;
  }
}
