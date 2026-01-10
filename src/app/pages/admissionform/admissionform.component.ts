import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

// PrimeNG
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

// Services
import { WidgetsService } from '../../widgets/services/widgets.service';
import { FormService } from '../../widgets/services/form.service';
import { RegStoreService } from '../../services/regstore.service';
import { ApplicationService } from '../../services/application.service';
import { formstepDTO } from '../../data/application/form.dto';
import { TAcademicHistory, TNextOfKinDTO, TOLevelResult, TPersonalDetailDTO, TUploadFile } from '../../data/application/transformer.dto';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';
import { States } from '../../data/application/location.dto';
import { LGA } from '../../data/application/registrantdatadto';
import { Address } from '../../data/application/personaldetailsdto';
import { TraceabilityModule } from '../../shared/traceability.module';
import { PersonaldetailsComponent } from '../../widgets/admission/forms/personaldetails/personaldetails.component';
import { NextofkinComponent } from '../../widgets/admission/forms/nextofkin/nextofkin.component';
import { AcademichistoryComponent } from "../../widgets/admission/forms/academichistory/academichistory.component";
import { UploadformComponent } from "../../widgets/admission/forms/uploadform/uploadform.component";
import { ApplicationsummaryComponent } from "../../widgets/admission/forms/applicationsummary/applicationsummary.component";

@Component({
  selector: 'app-admissionform',
  standalone: true,
  templateUrl: './admissionform.component.html',
  styleUrl: './admissionform.component.scss',
  imports: [
    TraceabilityModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    StepperModule,
    PersonaldetailsComponent,
    NextofkinComponent,
    AcademichistoryComponent,
    UploadformComponent,
    ApplicationsummaryComponent
],
  providers: [MessageService]
})
export class AdmissionformComponent implements OnInit {

  app_no: string = "";
  visible: boolean = false;
  sidebarVisible = false;

  // Loading states for each step
  isLoadingPersonal: boolean = false;
  isLoadingNextOfKin: boolean = false;
  isLoadingAcademic: boolean = false;
  isLoadingDocuments: boolean = false;

  _widgetService = inject(WidgetsService);
  _formStepService = inject(FormService);
  _appservice = inject(ApplicationService);
  _preRegData = inject(RegStoreService);
  cd = inject(ChangeDetectorRef);
  router = inject(Router);
  messageService = inject(MessageService);

  formStepStatus: formstepDTO = {
    academicValid: false,
    docuplodValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  };

  _personalFormData: TPersonalDetailDTO | null = null;
  _nextofkinFormData: TNextOfKinDTO | null = null;
  _academicHistoryFormData: TAcademicHistory[] | null = null;
  _olevelFormData: TOLevelResult[] | null = null;
  _uploadFileFormData: TUploadFile | null = null;

  _states: States[] | undefined;
  _lgas: LGA[] | undefined;

  activeStepIndex: number = 1;

  constructor() {
    this._widgetService.sidebarState$.subscribe((state: sidebarStateDTO) => {
      this.sidebarVisible = state.isvisible;
    });

    this._formStepService.formsteps$.subscribe((step: formstepDTO) => {
      this.formStepStatus = step;
    });

    this._formStepService.personalform$.subscribe((data: TPersonalDetailDTO | null) => {
      if (data != null) {
        this._personalFormData = data;
      }
    });

    this._formStepService.nextofkinform$.subscribe((data: TNextOfKinDTO | null) => {
      if (data != null) {
        this._nextofkinFormData = data;
      }
    });

    this._formStepService.uploadFile$.subscribe((data: TUploadFile | null) => {
      if (data != null) {
        this._uploadFileFormData = data;
      }
    });

    this._formStepService.academicHistory$.subscribe((data: TAcademicHistory[] | null) => {
      if (data != null) {
        this._academicHistoryFormData = data;
      }
    });

    this._formStepService.olevelResult$.subscribe((data: TOLevelResult[] | null) => {
      if (data != null) {
        this._olevelFormData = data;
      }
    });
  }

  ngOnInit(): void {
    this._appservice.registrationData().subscribe({
      next: (data) => {
        this._preRegData.setpreRegData(data);
      },
      error: (err) => {
        this.showError('Registration Data', 'Failed to load registration data');
      }
    });

    this._appservice.countries().subscribe({
      next: (data) => {
        this._preRegData.setCountryData(data);
      },
      error: (err) => {
        this.showError('Country Data', 'Failed to load country data');
      }
    });

    this._appservice.states().subscribe({
      next: (data) => {
        this._preRegData.setStateData(data);
      },
      error: (err) => {
        this.showError('State Data', 'Failed to load state data');
      }
    });

    this._preRegData.stateData$.subscribe(data => {
      if (data != undefined) {
        this._states = data.data;
      }
    });

    this._preRegData.lgaData$.subscribe(data => {
      if (data != undefined) {
        this._lgas = data;
      }
    });
  }

  saveAndMoveToStep(nextStep: number, saveFunction: () => Promise<void>) {
    saveFunction()
      .then(() => {
        this.activateStep(nextStep);
      })
      .catch((error) => {
        console.error('Save failed:', error);
      });
  }

  activateStep(step: number) {
    this.activeStepIndex = step;
  }

  savePersonalDetails(): Promise<void> {
    this.isLoadingPersonal = true;
    let _pd = this.buildPersonalDetailObj();
    return new Promise((resolve, reject) => {
      this.app_no = sessionStorage.getItem("APP_NO") || "";
      firstValueFrom(this._appservice.personalDetails(this.app_no, _pd))
        .then((data) => {
          this.showSuccess("Personal Detail", "Saved Successfully");
          this.isLoadingPersonal = false;
          resolve();
        })
        .catch(err => {
          let erMsg = this.extractErrorMessage(err);
          this.showError("Personal Detail", erMsg);
          this.isLoadingPersonal = false;
          reject(erMsg);
        });
    });
  }

  saveNextOfKinDetails(): Promise<void> {
    this.isLoadingNextOfKin = true;
    let _nk = this.buildNextOfKinDetailObj();
    return new Promise((resolve, reject) => {
      this.app_no = sessionStorage.getItem("APP_NO") || "";
      firstValueFrom(this._appservice.personalDetails(this.app_no, { primary_parent_or_guardian: _nk }))
        .then((data) => {
          this.showSuccess("Next Of Kin Details", "Saved Successfully");
          this.isLoadingNextOfKin = false;
          resolve();
        })
        .catch(err => {
          let erMsg = this.extractErrorMessage(err);
          this.showError("Next Of Kin Details", erMsg);
          this.isLoadingNextOfKin = false;
          reject(erMsg);
        });
    });
  }

  saveAcademicHistory(): Promise<void> {
    this.isLoadingAcademic = true;
    let _ad = this.buildAcademicDetailObj();
    let _ol = this.buildolevelDetailObj();
    return new Promise((resolve, reject) => {
      this.app_no = sessionStorage.getItem("APP_NO") || "";
      firstValueFrom(this._appservice.personalDetails(this.app_no, { academic_history: _ol, o_level_result: _ad }))
        .then((data) => {
          this.showSuccess("Academic Details", "Saved Successfully");
          this.isLoadingAcademic = false;
          resolve();
        })
        .catch(err => {
          let erMsg = this.extractErrorMessage(err);
          this.showError("Academic Details", erMsg);
          this.isLoadingAcademic = false;
          reject(erMsg);
        });
    });
  }

  saveDocumentUpload(): Promise<void> {
    this.isLoadingDocuments = true;
    let _up = this.buildDocumentUploadObj();
    let _ad = this.buildAcademicDetailObj();
    let _ol = this.buildolevelDetailObj();
    if (_ad && _ad[0] && _up?.olevels[0]) {
      _ad[0].file = _up?.olevels[0];
    }

    return new Promise((resolve, reject) => {
      this.app_no = sessionStorage.getItem("APP_NO") || "";
      firstValueFrom(this._appservice.personalDetails(this.app_no, {
        certificate_of_birth: _up?.certificateofbirth,
        passport_photo: _up?.passport,
        certificate_of_origin: _up?.origin,
        utme_result: { file: _up?.utme, score: 0 },
        o_level_result: _ad,
      }))
        .then((data) => {
          this.showSuccess("Document Upload", "Saved Successfully");
          this.isLoadingDocuments = false;
          resolve();
        })
        .catch(err => {
          this.showError("Document Upload", "Upload Failed");
          this.isLoadingDocuments = false;
          reject(err);
        });
    });
  }

  // Helper methods
  extractErrorMessage(err: any): string {
    if (err.error && err.error?.errors?.non_field_errors) {
      return err.error.errors.non_field_errors[0];
    } else if (err.error && err.error.non_field_errors) {
      return err.error.non_field_errors[0];
    } else if (err.error && err.error.message) {
      return err.error.message;
    }
    return "Unable to Save";
  }

  showSuccess(summary: string, detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: summary,
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

  buildolevelDetailObj() {
    let _allAcHistory: TAcademicHistory[] = [];
    if (this._academicHistoryFormData != null) {
      this._academicHistoryFormData.forEach((val, i) => {
        if (val.institution != "") {
          _allAcHistory.push({
            institution: val.institution,
            certificate_type: val.certificate_type,
            from_date: val.from_date,
            to_date: val.to_date
          });
        }
      });
    }
    return _allAcHistory;
  }

  buildAcademicDetailObj() {
    let _allOlevel: TOLevelResult[] = [];
    if (this._olevelFormData != null) {
      this._olevelFormData.forEach((val, i) => {
        _allOlevel.push({
          subjects: val.subjects,
          name: val.name
        });
      });
    }
    return _allOlevel;
  }

  buildDocumentUploadObj() {
    if (this._uploadFileFormData != null) {
      return this._uploadFileFormData;
    }
    return;
  }

  buildPersonalDetailObj() {
    if (this._personalFormData != null) {
      let _caddress: Address = {
        address: `${this._personalFormData.houseNumber}, ${this._personalFormData.streetName}, ${this._personalFormData.areaTown}`,
        street_name: this._personalFormData.streetName,
        land_mark: this._personalFormData.landmark,
        city: this._personalFormData.areaTown,
        lga_id: this._personalFormData.localGovernment
      };
      let _raddress: Address = {
        address: `${this._personalFormData.houseNumber}, ${this._personalFormData.streetName}, ${this._personalFormData.areaTown}`,
        street_name: this._personalFormData.streetName,
        land_mark: this._personalFormData.landmark,
        city: this._personalFormData.areaTown,
        lga_id: this._personalFormData.residentialLocalGovernment
      };
      let _personalDetail: any = {
        marital_status: this._personalFormData.maritalStatus,
        disability: this._personalFormData.disability == "Yes" ? `${this._personalFormData.disability}, ${this._personalFormData.disabilityDetails}` : `${this._personalFormData.disability}`,
        residential_address: _raddress,
        correspondence_address: _caddress,
        nationality: this._personalFormData.nationality,
        dob: this._personalFormData.dateOfBirth ? this._personalFormData.dateOfBirth.toISOString().split('T')[0] : '',
        gender: this._personalFormData.gender,
        lga: this._lgas?.filter(f => f.id == +this._personalFormData!.localGovernment)[0].name,
        state_of_origin: this._states?.filter(f => f.id == +this._personalFormData!.stateOfOrigin)[0].name,
      };
      return _personalDetail;
    }
  }

  buildNextOfKinDetailObj() {
    if (this._nextofkinFormData != null) {
      let _nokDetail: any = {
        title: this._nextofkinFormData.title,
        first_name: this._nextofkinFormData.firstname,
        last_name: this._nextofkinFormData.lastname,
        email: this._nextofkinFormData.email,
        gender: this._nextofkinFormData.gender,
        phone_number: this._nextofkinFormData.phonenumber,
        occupation: this._nextofkinFormData.occupation,
        nationality: this._nextofkinFormData.nationality,
        residential_address: `${this._nextofkinFormData.houseNumber}, ${this._nextofkinFormData.streetName},${this._nextofkinFormData.landmark}, ${this._nextofkinFormData.areaTown}`,
        correspondence_address: `${this._nextofkinFormData.houseNumber}, ${this._nextofkinFormData.streetName},${this._nextofkinFormData.landmark}, ${this._nextofkinFormData.areaTown}`,
        lga: this._lgas?.filter(f => f.id == +this._nextofkinFormData!.localGovernment)[0].name,
        state_of_origin: this._states?.filter(f => f.id == +this._nextofkinFormData!.stateOfOrigin)[0].name,
      };
      return _nokDetail;
    }
  }

  confirm() {
    this.visible = true;
    this.cd.detectChanges();
  }

  done() {
    this.visible = false;
    setTimeout(() => {
      this.router.navigateByUrl("/pages/dashboard");
    }, 1500);
  }
}