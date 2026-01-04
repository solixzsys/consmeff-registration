import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { TraceabilityModule } from '../../../shared/traceability.module';

@Component({
  selector: 'app-otp-page',
  templateUrl: './otp-page.component.html',
  styleUrl: './otp-page.component.scss',
  imports:[TraceabilityModule],
  providers: [MessageService]
})
export class OtpPageComponent implements OnInit {
  @ViewChildren('box1Input, box2Input, box3Input, box4Input, box5Input, box6Input')
  inputElements!: QueryList<ElementRef>;

  busy = false;
  isDarkMode = false;
  complete = false;
  otpForm!: FormGroup;
  email: string = '';

  get box1(): AbstractControl { return this.otpForm.controls['box1']; }
  get box2(): AbstractControl { return this.otpForm.controls['box2']; }
  get box3(): AbstractControl { return this.otpForm.controls['box3']; }
  get box4(): AbstractControl { return this.otpForm.controls['box4']; }
  get box5(): AbstractControl { return this.otpForm.controls['box5']; }
  get box6(): AbstractControl { return this.otpForm.controls['box6']; }

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = sessionStorage.getItem('profile_email') || 'your email';
    
    this.otpForm = new FormGroup({
      box1: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
      box2: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
      box3: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
      box4: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
      box5: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
      box6: new FormControl('', [Validators.required, Validators.pattern(/^\d$/)]),
    });

    this.otpForm.valueChanges.subscribe(() => {
      this.complete = this.otpForm.valid;
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark');
  }

  onInput(event: Event, nextBox: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow digits
    if (!/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    // Move to next input
    if (value && nextBox <= 6) {
      const inputs = this.inputElements.toArray();
      if (inputs[nextBox - 1]) {
        inputs[nextBox - 1].nativeElement.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, currentBox: number): void {
    const input = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace' && !input.value && currentBox > 1) {
      const inputs = this.inputElements.toArray();
      if (inputs[currentBox - 2]) {
        inputs[currentBox - 2].nativeElement.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';

    // Validate pasted data
    if (!/^\d{6}$/.test(pastedData.trim())) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid OTP',
        detail: 'Only 6-digit numeric values are allowed!',
        life: 3000
      });
      return;
    }

    // Fill all boxes
    const digits = pastedData.trim().split('');
    this.box1.setValue(digits[0]);
    this.box2.setValue(digits[1]);
    this.box3.setValue(digits[2]);
    this.box4.setValue(digits[3]);
    this.box5.setValue(digits[4]);
    this.box6.setValue(digits[5]);

    // Focus last box
    const inputs = this.inputElements.toArray();
    if (inputs[5]) {
      inputs[5].nativeElement.focus();
    }
  }

  submitOTP(): void {
    if (this.otpForm.invalid) return;

    this.busy = true;
    const otp = `${this.box1.value}${this.box2.value}${this.box3.value}${this.box4.value}${this.box5.value}${this.box6.value}`;
    const otpObj = { 
      email: sessionStorage.getItem('profile_email'), 
      otp: otp 
    };

    this.authService.verifyOtp(otpObj).subscribe({
      next: (result) => {
        this.busy = false;
        if (result) {
          this.messageService.add({
            severity: 'success',
            summary: 'Login',
            detail: 'OTP Verified',
            life: 3000
          });
          
          setTimeout(() => {
            this.router.navigateByUrl('/auth/login');
          }, 1000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Login',
            detail: 'OTP verification failed',
            life: 5000
          });
        }
      },
      error: (err) => {
        this.busy = false;
        let errorMsg = 'OTP verification failed';

        if (err.error?.errors?.non_field_errors) {
          errorMsg = err.error.errors.non_field_errors[0];
        } else if (err.error?.non_field_errors) {
          errorMsg = err.error.non_field_errors[0];
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'OTP Verification',
          detail: errorMsg,
          life: 5000
        });
      }
    });
  }
}