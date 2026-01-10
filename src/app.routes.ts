import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { authGuard } from './app/services/auth.guard.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'pages/dashboard', pathMatch: 'full' }, // Add this
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
        ]
    },

    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    
    { path: '**', redirectTo: '/auth/login' } // This will catch all unknown routes
];