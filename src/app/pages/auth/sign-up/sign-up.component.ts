import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { Router, RouterModule } from '@angular/router';

import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../../services/auth.service';

import { MessageService } from 'primeng/api';

import { Subject, throttleTime } from 'rxjs';
import { ProfilePayload, ProfileSuccessResponse, validationCheckDTO } from '../../../data/auth/auth.data';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordStrength } from '../../../utility/formvalidators';
import { TraceabilityModule } from '../../../shared/traceability.module';
@Component({
  selector: 'app-sign-up',
  imports: [ AppFloatingConfigurator, TraceabilityModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  providers: [MessageService],
})
export class SignUpComponent {
    passToggle: boolean = false;
    passToggle2: boolean = false;
    busy: boolean = false;
    private clickSubject = new Subject<void>();
  
    validationCheck: validationCheckDTO[] = [
      {
        title: "Minimum of 8 characters",
        status: false
      },
      {
        title: "At least one special character",
        status: false
      },
      {
        title: "At least one uppercase letter",
        status: false
      },
      {
        title: "At least one lowercase letter",
        status: false
      },
      {
        title: "At least one number",
        status: false
      },
  
  
    ];
    isDarkMode = false;

toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('dark');
}
  
  
    regForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
  
      firstname: new FormControl('', Validators.required),
      middlename: new FormControl(''),
      lastname: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, passwordStrength()]),
      cpassword: new FormControl('', [Validators.required]),
      phonenumber: new FormControl('', Validators.required),
      altphonenumber: new FormControl('')
    });
  
    get email(): AbstractControl { return this.regForm.controls.email }
  
    get firstname(): AbstractControl { return this.regForm.controls.firstname }
    get middlename(): AbstractControl { return this.regForm.controls.middlename }
    get lastname(): AbstractControl { return this.regForm.controls.lastname }
    get password(): AbstractControl { return this.regForm?.controls.password }
    get cpassword(): AbstractControl { return this.regForm.controls.cpassword }
    get phonenumber(): AbstractControl { return this.regForm.controls.phonenumber }
    get altphonenumber(): AbstractControl { return this.regForm.controls.altphonenumber }
  
  
    constructor(
      private authService: AuthService,
      private messageService: MessageService,
      private router: Router,
    //   private spinner: NgxSpinnerService,
      private cd: ChangeDetectorRef
  
    ) {
      this.password.valueChanges.subscribe((val: string) => {
        this.updateValidationStatus(val);
      })
      this.clickSubject
        .pipe(throttleTime(1000))
        .subscribe(() => {
          if (!this.busy) {
            this.registering();
          }
  
        });
    }
  
    updateValidationStatus(password: string) {
      this.validationCheck = this.validationCheck.map((item) => {
        switch (item.title) {
          case "Minimum of 8 characters":
            return { ...item, status: password.length >= 8 };
  
          case "At least one special character":
            return { ...item, status: /[!@#$%^&*(),.?":{}|<>]/.test(password) };
  
          case "At least one uppercase letter":
            return { ...item, status: /[A-Z]/.test(password) };
  
          case "At least one lowercase letter":
            return { ...item, status: /[a-z]/.test(password) };
  
          case "At least one number":
            return { ...item, status: /[0-9]/.test(password) };
  
          default:
            return item; // Keep the item unchanged if no matching case
        }
      });
    }
  
  
    showToggle() {
      this.passToggle = !this.passToggle;
  
    }
    showToggle2() {
      this.passToggle2 = !this.passToggle2;
  
    }
  
    register() {
      this.clickSubject.next();
    }
  
    registering() {
      if (this.busy) {
        return;
      }
      if(this.regForm.invalid){
        return;
      }
      
      this.busy = true;
      const profileObj: ProfilePayload = {
        alt_phone_number: this.altphonenumber.value,
        email: this.email.value,
        first_name: this.firstname.value,
        other_names: this.middlename.value,
        last_name: this.lastname.value,
        password: this.password.value,
        phone_number: this.phonenumber.value
      };
  
  
      this.authService.create(profileObj).subscribe(
        {
          next: (resp: ProfileSuccessResponse) => {
            sessionStorage.setItem("profile_email", resp.email);
            
            this.messageService.add({ severity: 'success', summary: 'Profile Creation', detail: resp.message });
  
            
            setTimeout(() => {
              this.busy = false;
              this.router.navigateByUrl("/auth/otp-page")
            }, 5000);
  
          },
          error: (err: { error: { errors: { [x: string]: any[] } & { non_field_errors: string[] }; non_field_errors: string[]; message: string; }; }) => {
            let erMsg = "Profile Creation Failed";
  
  
            if (err.error && err.error?.errors?.non_field_errors) {
              erMsg = err.error.errors.non_field_errors[0];
            } else
              if (err.error && err.error.non_field_errors) {
                erMsg = err.error.non_field_errors[0];
              } else if(err.error && err.error?.errors){
                let _err="";
                for (const key in err.error?.errors) {
                  if (err.error?.errors.hasOwnProperty(key)) {
                      // Concatenate each error message
                      _err += `${key}: ${err.error?.errors[key].join(' ')} `;
                  }
              }
                erMsg=_err.trim();
              }
              else {
                erMsg = err.error.message;
              }
            
            this.messageService.add({ severity: 'error', summary: 'Profile Creation', detail: erMsg });
            this.busy = false;
          },
          complete: () => {
            
            this.busy = false;
          }
        }
      )
  
      console.log(profileObj)
    }
  
    destroyed(event: any) {
  
    }
  
  }
  