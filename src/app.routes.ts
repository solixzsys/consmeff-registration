import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';

// import { Documentation } from './app/pages/documentation/documentation';
// import { Landing } from './app/pages/landing/landing';
// import { Notfound } from './app/pages/notfound/notfound';
// import { productInformationResolverResolver } from './app/pages/traceability/services/product-information-resolver.resolver';

import { authGuard } from './app/services/auth.guard.guard';
import { Dashboard } from './app/pages/dashboard/dashboard.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },

        ]
    },
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    
    { path: '**', redirectTo: '/notfound' }
];
