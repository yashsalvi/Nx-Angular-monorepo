import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
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
