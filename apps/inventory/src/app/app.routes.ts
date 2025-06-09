import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { SingleInstanceGuard } from './guards/single-instance.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppShellComponent,
        canActivate: [SingleInstanceGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./app.component').then(m => m.AppComponent)
            }
        ]
    },
    {
        path: 'already-open',
        loadComponent: () => import('@angular-monorepo/shared-ui').then(m => m.AlreadyOpenComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
