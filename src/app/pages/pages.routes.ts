import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard.component';
import { PaymentComponent } from './payment/payment.component';
import { AdmissionformComponent } from './admissionform/admissionform.component';
import { ApplicationsummaryComponent } from '../widgets/admission/forms/applicationsummary/applicationsummary.component';

export default [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Add this
    { path: 'dashboard', component: Dashboard },
    { path: 'payment', component: PaymentComponent },
    { path: 'admissionform', component: AdmissionformComponent },
    { path: 'summarypage', component: ApplicationsummaryComponent },
   
    { path: '**', redirectTo: 'dashboard' } // Changed from /notfound
] as Routes;