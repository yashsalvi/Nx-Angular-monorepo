import { ProductListComponent } from '@angular-monorepo/products';
import { PushNotificationService } from '@angular-monorepo/push-notification';
import { SessionSyncService } from '@angular-monorepo/session-sync';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [ProductListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent implements OnInit {
    isMainTab = false;
    private inactivityTimeout?: ReturnType<typeof setTimeout>;
    private takeoverCheckIntervalId?: ReturnType<typeof setInterval>;

    constructor(private sessionSync: SessionSyncService, private pushNotifService: PushNotificationService) {
      // navigator.serviceWorker.register('firebase-messaging-sw.js').then((registration)=> {
      //   console.log("service worker register")
      // }).catch((err)=>{
      //   console.log('service wroker registratoin failed', err)
      // })
    }

    ngOnInit(): void {
      console.log('[AppShell] Component initialized');
      this.pushNotifService.listenForMessages()
       if ('locks' in navigator) {
      navigator.locks.request('main-tab-lock', async () => {
        console.log('[AppShell] Holding main-tab-lock');

        await new Promise((resolve) =>
          window.addEventListener('beforeunload', resolve)
        );
      });
    }

      const session = { userId: 'abc123', token: 'securetoken' };
      localStorage.setItem('session', JSON.stringify(session));
      this.sessionSync.syncSessionToOtherTabs(session);

      console.log('Initial session sync done:', this.sessionSync.getCurrentSession());


      setTimeout(() => this.checkMainTab(), 1500);

      
      this.takeoverCheckIntervalId = setInterval(() => {
        this.checkMainTab();
      }, 5000);

      document.addEventListener('visibilitychange', this.handleTabVisibility);
    }

    
  requestNotificationPermission(){
    this.pushNotifService.requestPermission();
  }

    ngOnDestroy(): void {
      if (this.takeoverCheckIntervalId) clearInterval(this.takeoverCheckIntervalId);
      if (this.inactivityTimeout) clearTimeout(this.inactivityTimeout);
      document.removeEventListener('visibilitychange', this.handleTabVisibility);
      this.sessionSync.stopMainTabStatus();
    }

  private checkMainTab(): void {
    // Don't re-elect if already the main tab
    if (this.isMainTab) return;

    if (!this.sessionSync.isAnotherMainTabActive()) {
      this.sessionSync.startMainTabStatus();
      this.isMainTab = true;
      console.log('✅ This tab is now the main tab.');
    } else {
      this.isMainTab = false;
      // console.log('🚫 Another main tab is already active.');
    }
  }

    private handleTabVisibility = () => {
      if (document.hidden) {
        this.inactivityTimeout = setTimeout(() => {
          alert('⚠️ You have been inactive or switched tabs.');
        }, 3000);
      } else {
        if (this.inactivityTimeout) clearTimeout(this.inactivityTimeout);
      }
    };
}
