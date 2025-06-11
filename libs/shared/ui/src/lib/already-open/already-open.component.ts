import { Component,OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'angular-monorepo-already-open',
  standalone: true,
  templateUrl: './already-open.component.html',
  styleUrls: ['./already-open.component.css']
})
export class AlreadyOpenComponent  implements OnInit, OnDestroy {
  private intervalId?: ReturnType<typeof setInterval>;
  constructor(private router: Router){
  const mainTabId = localStorage.getItem('mainTabId');
  const thisTabId = localStorage.getItem('thisTabId');

  console.log(`[AlreadyOpenComponent] Redirected tabId: ${thisTabId}`);
  console.log(`[AlreadyOpenComponent] Active main tabId: ${mainTabId}`);
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.tryTakeLock();
    }, 2000); // Retry every 2s
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async tryTakeLock(): Promise<void> {
    if (!('locks' in navigator)) return;

    let lockAcquired = false;

    await navigator.locks.request(
      'main-tab-lock',
      { ifAvailable: true, mode: 'exclusive' },
      (lock) => {
        if (lock) {
          lockAcquired = true;
        }
      }
    );

    if (lockAcquired) {
      console.log('✅ Recovered lock, redirecting to /');
      sessionStorage.setItem('recoveredLock', 'true');
      this.router.navigateByUrl('/');
    }
  }
}
