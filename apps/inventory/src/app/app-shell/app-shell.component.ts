import { ProductListComponent } from '@angular-monorepo/products';
import { SessionSyncService } from '@angular-monorepo/session-sync';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [ProductListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent implements OnInit, OnDestroy {
  isMainTab = false;
  private inactivityTimeout?: ReturnType<typeof setTimeout>;
  private takeoverCheckIntervalId?: ReturnType<typeof setInterval>;

  constructor(private sessionSync: SessionSyncService, private router: Router) {}

  ngOnInit(): void {
    console.log('[AppShell] Component initialized');

    const session = { userId: 'abc123', token: 'securetoken' };
    localStorage.setItem('session', JSON.stringify(session));
    this.sessionSync.syncSessionToOtherTabs(session);

    console.log('Initial session sync done:', this.sessionSync.getCurrentSession());

    // Delay before checking who is main tab
    setTimeout(() => this.checkMainTab(), 1500);

    // Regularly check if this tab should take over
    this.takeoverCheckIntervalId = setInterval(() => {
      this.checkMainTab();
    }, 5000);

    document.addEventListener('visibilitychange', this.handleTabVisibility);
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
    console.log('🚫 Another main tab is already active.');
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
