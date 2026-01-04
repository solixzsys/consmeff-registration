import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { TraceabilityModule } from '../../../shared/traceability.module';

@Component({
  selector: 'app-request-passwordreset',
  templateUrl: './request-passwordreset.component.html',
  imports: [TraceabilityModule],
  styleUrl: './request-passwordreset.component.scss',
  providers: [MessageService]
})
export class RequestPasswordresetComponent {
  busy = false;
  isDarkMode = false;

  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  get email() {
    return this.resetForm.controls.email;
  }

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark');
  }

  resetPass() {
    if (this.resetForm.invalid) return;

    this.busy = true;
    this.authService.verifyEmail({ 
      email: this.resetForm.controls.email.value 
    }).subscribe({
      next: (data: any) => {
        this.busy = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Password Reset',
          detail: data.message,
          life: 6000
        });
        
        sessionStorage.setItem('profile_email', this.resetForm.controls.email.value!.trim());
        
        // Navigate after showing message
        setTimeout(() => {
          this.router.navigateByUrl('/auth/passwordreset');
        }, 1000);
      },
      error: () => {
        this.busy = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Password Reset',
          detail: 'Please contact admin!',
          life: 5000
        });
      }
    });
  }
}