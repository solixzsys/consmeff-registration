
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';

import { TraceabilityModule } from '../../../shared/traceability.module';


@Component({
  selector: 'procapx-login',
  standalone: true,
  imports: [TraceabilityModule],
  templateUrl: './consmeff-login.component.html',
  styleUrls: ['./consmeff-login.component.scss'],
  providers: [MessageService]
})
export class ConsmeffLoginComponent implements OnInit {
  email = '';
  password = '';
  rememberMe = false;
  showPassword = signal(false);
  isDarkMode = signal(false);
  isLoading = signal(false);
  errorMessage = '';
  private returnUrl = '/';
  loginForm!: FormGroup;


  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(private authService: AuthService,private messageService: MessageService,) {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      this.isDarkMode.set(savedDarkMode === 'true');
    } else {
      this.isDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  toggleDarkMode() {
    this.isDarkMode.update(value => !value);
    localStorage.setItem('darkMode', this.isDarkMode().toString());
  }

  async login() {
    this.isLoading.set(true);
    this.errorMessage = '';
    let payload: { username: string, password: string } = {
      password: this.loginForm.controls["password"].value,
      username: this.loginForm.controls["email"].value,
    }

    this.authService.login(payload).subscribe({
      next: (result) => {
        this.messageService.add({ severity: 'success', summary: 'Login', detail: 'Login Successful' });
        this.isLoading.set(false);
        this.router.navigateByUrl("/pages/dashboard")
      },
      error: (err) => {
        let erMsg = "Login Failed";


        if (err.error && err.error?.errors?.non_field_errors) {
          erMsg = err.error.errors.non_field_errors[0];
        } else
          if (err.error && err.error.non_field_errors) {
            erMsg = err.error.non_field_errors[0];
          } else {
            erMsg = err.error.message;
          }
        this.messageService.add({ severity: 'error', summary: 'Login', detail: erMsg });
        this.isLoading.set(false);
        
      },
      complete: () => {
        this.isLoading.set(false);
      },
    })


  }
}
