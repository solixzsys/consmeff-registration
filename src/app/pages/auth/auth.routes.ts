import { Routes } from '@angular/router';
import { Access } from './access';

import { Error } from './error';

import { Logout } from './logout';
// import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
// import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ConsmeffLoginComponent } from './sigin/consmeff-login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RequestPasswordresetComponent } from './request-passwordreset/request-passwordreset.component';
import { Password } from 'primeng/password';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { OtpPageComponent } from './otp-page/otp-page.component';

export default [
    { path: '', component: ConsmeffLoginComponent },
    { path: 'login', component: ConsmeffLoginComponent },
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    
    { path: 'logout', component: Logout },
    { path: 'signup', component: SignUpComponent },
    { path: 'request-passwordreset', component: RequestPasswordresetComponent },
    { path: 'passwordreset', component: PasswordresetComponent },
    { path: 'otp-page', component: OtpPageComponent },
    // { path: 'otp', component: OtpVerificationComponent },
    // { path: 'passwordreset', component: PasswordResetComponent }
] as Routes;
