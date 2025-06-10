import { Injectable } from '@angular/core';

// session-sync.service.ts
@Injectable({
  providedIn: 'root'
})
export class SessionSyncService {
  private readonly SESSION_KEY = 'session';
  private readonly SESSION_CHANNEL = 'session_channel';
  private readonly MAIN_TAB_KEY = 'mainTabPing';
  private readonly MAIN_TAB_INTERVAL = 2000;
  private broadcastChannel = new BroadcastChannel(this.SESSION_CHANNEL);

  private mainTabIntervalId?: ReturnType<typeof setInterval>;

  constructor() {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'sync-session') {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(event.data.payload));
      }
    };
  }

  syncSessionToOtherTabs(session: any): void {
    this.broadcastChannel.postMessage({
      type: 'sync-session',
      payload: session
    });
  }

  getCurrentSession(): any {
    const session = localStorage.getItem(this.SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }

  startMainTabStatus(): void {
    if (!this.mainTabIntervalId) {
      this.mainTabIntervalId = setInterval(() => {
        localStorage.setItem(this.MAIN_TAB_KEY, Date.now().toString()); // ✅ Correct key
      }, this.MAIN_TAB_INTERVAL);
    }
  }

  stopMainTabStatus(): void {
    if (this.mainTabIntervalId) {
      clearInterval(this.mainTabIntervalId);
      this.mainTabIntervalId = undefined;
    }
    localStorage.removeItem(this.MAIN_TAB_KEY);
  }

  isAnotherMainTabActive(): boolean {
    const lastActive = localStorage.getItem(this.MAIN_TAB_KEY);
    if (!lastActive) return false;
    const diff = Date.now() - Number(lastActive);
    return diff < this.MAIN_TAB_INTERVAL * 2;
  }
}

