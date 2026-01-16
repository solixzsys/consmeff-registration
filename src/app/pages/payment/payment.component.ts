import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../widgets/sidebar/sidebar.component';
import { TopbarComponent } from '../../widgets/topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { BlockUIModule } from 'primeng/blockui';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Services & DTOs
import { WidgetsService } from '../../widgets/services/widgets.service';
import { ApplicationService } from '../../services/application.service';
import { TraceabilityModule } from '../../shared/traceability.module';
import { CertificateOfBirth, RegistrantData } from '../../data/application/registrantdatadto';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';
import { PaymentRefResponse } from '../../data/dashboard/payment.data';




declare let PaystackPop: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    TraceabilityModule,SidebarComponent,TopbarComponent,
  ],
  providers: [MessageService],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  sidebarVisible = false;
  _widgetService = inject(WidgetsService);
  
  uploadMsg = "Upload payment evidence";
  canpay: boolean = false;
  canupload: boolean = false;
  regData: RegistrantData | undefined;
  paymentFile: File | undefined;
  btnState: number = 0;
  canMove: boolean = false;
  app_no: string | undefined;
  paymentUploadResult: CertificateOfBirth | undefined;
  uploadProgress: number = 0;
  isLoading: boolean = false;
  paymentProcessing: boolean = false;

  paymentForm = new FormGroup({
    pay: new FormControl(false),
    payslip: new FormControl(false)
  });

  constructor(
    private router: Router,
    private appService: ApplicationService,
    private messageService: MessageService
  ) {
    this._widgetService.sidebarState$.subscribe((state: sidebarStateDTO) => {
      this.sidebarVisible = state.isvisible;
    });

    this.paymentForm.controls.pay.valueChanges.subscribe(val => {
      this.canpay = val || false;
    });

    this.paymentForm.controls.payslip.valueChanges.subscribe(val => {
      this.canupload = val || false;
    });
  }

  uploadPayment(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      this.showError('Invalid File', 'Please upload an image or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.showError('File Too Large', 'File size should not exceed 5MB');
      return;
    }

    this.uploadMsg = file.name;
    this.paymentFile = file;
    
    // Simulate upload progress
    this.uploadProgress = 10;
    setTimeout(() => {
      this.paymentUploadSubmit();
    }, 500);
  }

  async paymentUploadSubmit() {
    this.app_no = sessionStorage.getItem("APP_NO") || "";
    
    if (!this.paymentFile) {
      this.showError('No File', 'Please select a file to upload');
      return;
    }

    this.isLoading = true;
    this.uploadProgress = 30;
    
    let formData = new FormData();
    formData.append("file", this.paymentFile);

    try {
      // Upload file
      this.uploadProgress = 50;
      this.paymentUploadResult = await firstValueFrom(
        this.appService.uploadFile(formData)
      );

      if (!this.paymentUploadResult || this.paymentUploadResult.file_size === 0) {
        throw new Error('Upload failed');
      }

      this.uploadProgress = 70;

      // Update payment slip
      await firstValueFrom(
        this.appService.personalDetails(this.app_no, { 
          payment_slip: this.paymentUploadResult 
        })
      );

      this.uploadProgress = 100;
      this.btnState = 1;
      this.canMove = true;
      
      this.showSuccess('Upload Successful', 'Payment evidence uploaded successfully');
      
      // Reset progress after a delay
      setTimeout(() => {
        this.uploadProgress = 0;
      }, 2000);

    } catch (err: any) {
      this.uploadProgress = 0;
      const errorMsg = err?.error?.non_field_errors?.[0] || 'Unable to upload payment evidence';
      this.showError('Upload Failed', errorMsg);
    } finally {
      this.isLoading = false;
    }
  }

  getPaymentRef() {
    const app_no = sessionStorage.getItem("APP_NO") || "";

    if (!app_no) {
      this.showError('Error', 'Application number not found');
      return;
    }

    this.paymentProcessing = true;

    this.appService.getPaymentRef({ application_no: app_no })
      .subscribe({
        next: (data) => {
          this.paymentProcessing = false;
          if (data && data.ref_id) {
            this.makePayment(data);
          }
        },
        error: (err) => {
          this.paymentProcessing = false;
          this.showError('Payment Error', 'Unable to initialize payment. Please try again.');
        }
      });
  }

  makePayment(ref: PaymentRefResponse) {
    const app_no = sessionStorage.getItem("APP_NO") || "";
    
    const handler = PaystackPop.setup({
      key: 'pk_test_3303a8dc18ea2a4b2728543b34813870ba6f8bd6',
      email: ref.email || "solixzdev@gmail.com",
      amount: +ref.amount * 100,
      currency: 'NGN',
      ref: ref.ref_id,
      callback: (response: any) => {
        const reference = response.reference;
        sessionStorage.setItem("paymentref", reference);

        this.isLoading = true;
        
        this.appService.verifyPayment({ ref_id: reference })
          .subscribe({
            next: (data) => {
              this.isLoading = false;
              this.showSuccess('Payment Successful', 'Your payment has been verified successfully, login to continue.');
              this.btnState = 1;
              this.canMove = true;
              
              setTimeout(() => {
                this.router.navigateByUrl("/auth/login");
              }, 1500);
            },
            error: (err) => {
              this.isLoading = false;
              this.showError('Verification Failed', 'Payment verification failed. Please contact support.');
            }
          });
      },
      onClose: () => {
        this.showWarning('Payment Cancelled', 'Transaction was not completed');
      },
    });
    
    handler.openIframe();
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('Copied!', 'Account number copied to clipboard');
    }).catch(() => {
      this.showError('Copy Failed', 'Unable to copy to clipboard');
    });
  }

  // Notification helpers
  private showSuccess(title: string, message: string) {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000
    });
  }

  private showError(title: string, message: string) {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 5000
    });
  }

  private showWarning(title: string, message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 4000
    });
  }
}