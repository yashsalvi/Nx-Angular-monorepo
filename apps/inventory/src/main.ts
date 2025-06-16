import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import '@angular-monorepo/lit-widgets';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
    }),
    provideServiceWorker('firebase-messaging-sw.js'),
  ],
}).catch((err) => console.error(err));

if('serviceWorker' in navigator){
navigator.serviceWorker.ready.then((registration)=> {
  console.log("Service Worker ready" + registration)
}).catch((error)=>{
  console.error("Service Worker not ready" +error)
})
}