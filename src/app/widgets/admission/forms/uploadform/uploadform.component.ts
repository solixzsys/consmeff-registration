import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

// PrimeNG Imports
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Services
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { FormService } from '../../../services/form.service';
import { RegStoreService } from '../../../../services/regstore.service';
import { formstepDTO } from '../../../../data/application/form.dto';
import { TUploadFile } from '../../../../data/application/transformer.dto';
import { ApplicationService } from '../../../../services/application.service';
import { CertificateOfBirth } from '../../../../data/application/registrantdatadto';
import { formatFileSize } from '../../../../utility/yearutil';

@Component({
  selector: 'app-uploadform',
  standalone: true,
  imports: [
    TraceabilityModule,
   
  ],
  providers: [MessageService],
  templateUrl: './uploadform.component.html',
  styleUrl: './uploadform.component.scss'
})
export class UploadformComponent implements AfterViewInit {
  _formStepService = inject(FormService);
  _regService = inject(RegStoreService);
  messageService = inject(MessageService);

  formStepStatus: formstepDTO = {
    academicValid: false,
    docuplodValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  };

  formValid: boolean = false;

  // Loading states
  isLoadingCertificate: boolean = false;
  isLoadingOlevel: boolean = false;
  isLoadingPassport: boolean = false;
  isLoadingOrigin: boolean = false;
  isLoadingUTME: boolean = false;

  CertificateFile: File | undefined;
  ResultFile: File | undefined;
  PassportFile: File | undefined;
  OriginFile: File | undefined;
  UTMEFile: File | undefined;

  fileObjects: TUploadFile = {
    certificateofbirth: {},
    olevels: [],
    passport: {},
    origin: {},
    utme: {}
  };

  placeholder: string = "../../../../assets/doc.png";

  constructor(private appservice: ApplicationService) {
    this._formStepService.formsteps$.subscribe((step: formstepDTO) => {
      this.formStepStatus = step || {
        academicValid: false,
        docuplodValid: false,
        nextofkinValid: false,
        personalinfoValid: false
      };
    });

    this._regService.uploadFile$.subscribe((f: any) => {
      if (f != null && f != undefined) {
        this.fileObjects = f as TUploadFile;
        // Ensure nested objects are initialized
        if (!this.fileObjects.certificateofbirth) this.fileObjects.certificateofbirth = {};
        if (!this.fileObjects.olevels) this.fileObjects.olevels = [];
        if (!this.fileObjects.passport) this.fileObjects.passport = {};
        if (!this.fileObjects.origin) this.fileObjects.origin = {};
        if (!this.fileObjects.utme) this.fileObjects.utme = {};
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.validateForm();
    }, 5000);
  }

  async onCertificateUpload(event: Event) {
    this.isLoadingCertificate = true;
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.CertificateFile = input.files[0];
      if (this.CertificateFile != undefined) {
        var _ppFD = new FormData();
        _ppFD.append("file", this.CertificateFile);
        await firstValueFrom(this.appservice.uploadFile(_ppFD))
          .then((data: CertificateOfBirth) => {
            if (data) {
              this.fileObjects.certificateofbirth = data;
              this.showSuccess('Certificate of Birth uploaded successfully');
            }
            this.isLoadingCertificate = false;
          })
          .catch(err => {
            this.isLoadingCertificate = false;
            const errorMessage = err?.error?.non_field_errors?.[0] || 'Upload failed';
            this.showError('Document Upload', errorMessage);
            this.removeFile(0);
            return;
          });
      }
      this.validateForm();
    }
  }

  async onOlevelUpload(event: Event) {
    this.isLoadingOlevel = true;
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.ResultFile = input.files[0];
      if (this.ResultFile != undefined) {
        var _ppFD = new FormData();
        _ppFD.append("file", this.ResultFile);
        await firstValueFrom(this.appservice.uploadFile(_ppFD))
          .then((data: CertificateOfBirth) => {
            if (data) {
              if (!this.fileObjects.olevels) {
                this.fileObjects.olevels = [];
              }
              this.fileObjects.olevels[0] = data;
              this.showSuccess("O'Level Result uploaded successfully");
            }
            this.isLoadingOlevel = false;
          })
          .catch(err => {
            this.isLoadingOlevel = false;
            const errorMessage = err?.error?.non_field_errors?.[0] || 'Upload failed';
            this.showError('Document Upload', errorMessage);
            this.removeFile(1);
            return;
          });
      }
      this.validateForm();
    }
  }

  async onPassportUpload(event: Event) {
    this.isLoadingPassport = true;
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.PassportFile = input.files[0];
      if (this.PassportFile != undefined) {
        var _ppFD = new FormData();
        _ppFD.append("file", this.PassportFile);
        await firstValueFrom(this.appservice.uploadFile(_ppFD))
          .then((data: CertificateOfBirth) => {
            if (data && this.fileObjects) {
              this.fileObjects.passport = data;
              this.showSuccess('Passport Photograph uploaded successfully');
            }
            this.isLoadingPassport = false;
          })
          .catch(err => {
            this.isLoadingPassport = false;
            const errorMessage = err?.error?.non_field_errors?.[0] || 'Upload failed';
            this.showError('Document Upload', errorMessage);
            this.removeFile(2);
            return;
          });
      }
      this.validateForm();
    }
  }

  async onOriginUpload(event: Event) {
    this.isLoadingOrigin = true;
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.OriginFile = input.files[0];
      if (this.OriginFile != undefined) {
        var _ppFD = new FormData();
        _ppFD.append("file", this.OriginFile);
        await firstValueFrom(this.appservice.uploadFile(_ppFD))
          .then((data: CertificateOfBirth) => {
            if (data && this.fileObjects) {
              this.fileObjects.origin = data;
              this.showSuccess('Certificate of Origin uploaded successfully');
            }
            this.isLoadingOrigin = false;
          })
          .catch(err => {
            this.isLoadingOrigin = false;
            const errorMessage = err?.error?.non_field_errors?.[0] || 'Upload failed';
            this.showError('Document Upload', errorMessage);
            this.removeFile(3);
            return;
          });
      }
      this.validateForm();
    }
  }

  async onUTMEUpload(event: Event) {
    this.isLoadingUTME = true;
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.UTMEFile = input.files[0];
      if (this.UTMEFile != undefined) {
        var _ppFD = new FormData();
        _ppFD.append("file", this.UTMEFile);
        await firstValueFrom(this.appservice.uploadFile(_ppFD))
          .then((data: CertificateOfBirth) => {
            if (data && this.fileObjects) {
              this.fileObjects.utme = data;
              this.showSuccess('UTME Result uploaded successfully');
            }
            this.isLoadingUTME = false;
          })
          .catch(err => {
            this.isLoadingUTME = false;
            const errorMessage = err?.error?.non_field_errors?.[0] || 'Upload failed';
            this.showError('Document Upload', errorMessage);
            this.removeFile(4);
            return;
          });
      }
      this.validateForm();
    }
  }

  removeFile(arg: number) {
    switch (arg) {
      case 0:
        this.CertificateFile = undefined;
        if (this.fileObjects?.certificateofbirth) {
          this.fileObjects.certificateofbirth = {};
        }
        break;
      case 1:
        this.ResultFile = undefined;
        if (this.fileObjects?.olevels && this.fileObjects.olevels.length > 0) {
          this.fileObjects.olevels[0] = undefined as any;
        }
        break;
      case 2:
        this.PassportFile = undefined;
        if (this.fileObjects?.passport) {
          this.fileObjects.passport = {};
        }
        break;
      case 3:
        this.OriginFile = undefined;
        if (this.fileObjects?.origin) {
          this.fileObjects.origin = {};
        }
        break;
      case 4:
        this.UTMEFile = undefined;
        if (this.fileObjects?.utme) {
          this.fileObjects.utme = {};
        }
        break;
      default:
        break;
    }
    this.validateForm();
  }

  validateForm() {
    const hasAllRequiredFiles =
      (this.CertificateFile != undefined || this.fileObjects?.certificateofbirth?.file_url != undefined) &&
      (this.PassportFile != undefined || this.fileObjects?.passport?.file_url != undefined) &&
      (this.UTMEFile != undefined || this.fileObjects?.utme?.file_url != undefined) &&
      (this.ResultFile != undefined || this.getOlevelFile()?.file_url != undefined) &&
      (this.OriginFile != undefined || this.fileObjects?.origin?.file_url != undefined);

    if (hasAllRequiredFiles && this.formStepStatus) {
      this.formStepStatus.docuplodValid = true;
      this._formStepService.setFormSteps(this.formStepStatus);
      this._formStepService.setuploadFileFormData(this.fileObjects);
    } else if (this.formStepStatus) {
      this.formStepStatus.docuplodValid = false;
      this._formStepService.setFormSteps(this.formStepStatus);
    }
  }

  passSize(s: any): string {
    if (s == null || s == undefined) {
      return '0 B';
    }
    return formatFileSize(+s);
  }

  getFileName(fileUrl: string | undefined): string {
    if (!fileUrl) {
      return 'Unknown file';
    }
    const parts = fileUrl.split("/");
    return parts[parts.length - 1] || 'Unknown file';
  }

  isOlevelFileAvailable(): boolean {
    return this.fileObjects?.olevels &&
      this.fileObjects.olevels.length > 0 &&
      this.fileObjects.olevels[0] != null &&
      this.fileObjects.olevels[0] != undefined;
  }

  getOlevelFile(): any {
    return this.isOlevelFileAvailable() ? this.fileObjects.olevels[0] : null;
  }

  showSuccess(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: detail,
      life: 3000
    });
  }

  showError(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 5000
    });
  }
}