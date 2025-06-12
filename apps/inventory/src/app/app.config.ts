import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideMessaging, getMessaging} from '@angular/fire/messaging'
import { provideFirebaseApp, initializeApp} from '@angular/fire/app'
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(
    provideFirebaseApp(()=> initializeApp(environment.firebase)),
    provideMessaging(() => getMessaging()),
    )
  ],
};
