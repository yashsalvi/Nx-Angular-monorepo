import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';

@Component({
    standalone: true,
  selector: 'angular-monorepo-pwa-install',
  imports: [CommonModule],
  template: `
  <div *ngIf="showInstallBtn">
  <button *ngIf="isAndroid && deferredPrompt" (click)="installApp()" class="install-btn">
  Install App
  </button>

  <div *ngIf="isIos && !isInStandaloneMode"  class="ios-hint">
    To install this app, tap <strong>Share</strong> then <strong>Add to Home Screen</strong>
  </div>
   </div>
  `,
  styles: [`
    .install-btn {
    background-color: #1976d2;
    color: white;
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    }
    .ios-hint {
    background-color:#fff3cd;
    color: #856404;
    border: 1px solid #ffeeba;
    padding: 12px;
    border-radius: 8px;
    margin-top: 8px;
    font-size: 14px;
    }
    `],
})
export class PwaInstallComponent implements OnInit {
    deferredPrompt: any = null
    showInstallBtn = false
    isIos = false
    isAndroid = false
    isInStandaloneMode = false
    ngOnInit(): void {
        this.isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
        this.isAndroid = /android/.test(window.navigator.userAgent.toLowerCase())
        this.isInStandaloneMode = ('standalone' in navigator) && (navigator as any).standalone
        window.addEventListener('beforeinstallprompt', (e: Event)=> {
            e.preventDefault();
            this.deferredPrompt =  e;
            this.showInstallBtn = true;
        })

        if(this.isIos && !this.isInStandaloneMode){
            this.isInStandaloneMode = true
        }
    }

    installApp(): void {
        if(this.deferredPrompt){
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((result: any)=>{
                if(result.outcome === 'accepted'){
                    console.log('Pwa install accepted')
                }else{
                    console.log('Pwn install dismissed')
                }
                this.deferredPrompt = null;
                this.showInstallBtn = false;
            })
        }
    }
}
