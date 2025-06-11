import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SingleInstanceGuard implements CanActivate {
  constructor(private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
  if (sessionStorage.getItem('recoveredLock') === 'true') {
    sessionStorage.removeItem('recoveredLock');
    console.log('✅ Bypassing guard due to recovered lock');
    return true;
  }

    if (!('locks' in navigator)) {
      console.warn('Web Locks API not supported in this browser.');
      return true;
    }

    const lockAvailable = await this.tryAcquireMainTabLock();

    if (lockAvailable) {
      console.log('✅ This tab is now the main tab');

     
      if (window.location.pathname === '/already-open') {
        return this.router.parseUrl('/');
      }

      return true;
    } else {
      console.log('🚫 Another main tab is already active');

      
      if (window.location.pathname !== '/already-open') {
        return this.router.parseUrl('/already-open');
      }

      return true;
    }
  }

  private async tryAcquireMainTabLock(): Promise<boolean> {
    try {
      let isMain = false;

      await navigator.locks.request(
        'main-tab-lock',
        { ifAvailable: true, mode: 'exclusive' },
        (lock) => {
          if (lock) {
            isMain = true;
          }
        }
      );

      return isMain;
    } catch (err) {
      console.error('Lock error:', err);
      return true;
    }
  }
}
