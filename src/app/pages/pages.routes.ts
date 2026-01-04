import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard.component';
import { PaymentComponent } from './payment/payment.component';
// import { Documentation } from './documentation/documentation';
// import { Crud } from './crud/crud';
// import { Empty } from './empty/empty';

export default [
    { path: 'dashboard', component: Dashboard },
    { path: 'payment', component: PaymentComponent },
    // { path: 'crud', component: Crud },
    // { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
