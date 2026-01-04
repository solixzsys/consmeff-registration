import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../services/auth.service';

import { MessageService } from 'primeng/api';
import { TraceabilityModule } from '../../shared/traceability.module';

@Component({
    selector: 'app-logout',
    standalone: true,
    imports: [TraceabilityModule],
    providers: [],
    styles: `
   
    `,
    template: `
     
    `
})
export class Logout {
    
 
    route = inject(Router)

    constructor(private fb: FormBuilder) {
      
    }

    ngOnInit(): void {
        sessionStorage.clear();
        setTimeout(() => {
            this.route.navigate(['/auth/login']);
        }, 1000);
    }

   

  
}