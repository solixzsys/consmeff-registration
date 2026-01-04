import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { SidebarComponent } from '../../widgets/sidebar/sidebar.component';
import { TopbarComponent } from '../../widgets/topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { WidgetsService } from '../../widgets/services/widgets.service';
import { sidebarStateDTO } from '../../data/dash.dto';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { PersonaldetailsComponent } from '../../widgets/forms/personaldetails/personaldetails.component';
import { FormService } from '../../widgets/services/form.service';
import { formstepDTO } from '../../data/form.dto';
import { NextofkinComponent } from '../../widgets/forms/nextofkin/nextofkin.component';
import { AcademichistoryComponent } from '../../widgets/forms/academichistory/academichistory.component';
import { UploadformComponent } from '../../widgets/forms/uploadform/uploadform.component';
import { ApplicationsummaryComponent } from '../../widgets/forms/applicationsummary/applicationsummary.component';
import { RegStoreService } from '../../services/regstore.service';
import { ApplicationService } from '../../services/application.service';
import { TAcademicHistory, TNextOfKinDTO, TOLevelResult, TPersonalDetailDTO, TUploadFile } from '../../data/transformer.dto';
import { Address } from '../../data/personaldetailsdto';
import { States } from '../../data/location.dto';
import { AcademicHistory, LGA, Subject } from '../../data/registrantdatadto';
import { firstValueFrom } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NotificationsService, SimpleNotificationsModule } from 'angular2-notifications';
import { Dialog } from 'primeng/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admissionform',
  imports: [SidebarComponent, TopbarComponent, CommonModule, StepperModule,
    AcademichistoryComponent,
    UploadformComponent,
    ApplicationsummaryComponent,
    SimpleNotificationsModule,
    NgxSpinnerModule,
    Dialog,
    ButtonModule, PersonaldetailsComponent, NextofkinComponent],
  templateUrl: './admissionform.component.html',
  styleUrl: './admissionform.component.scss'
})
export class AdmissionformComponent implements OnInit {


  app_no: string = "";
  visible: boolean = false;

  saveandnext(arg0: number) {
    throw new Error('Method not implemented.');
  }

  sidebarVisible = false;
  _widgetService = inject(WidgetsService)
  _formStepService = inject(FormService)
  _appservice = inject(ApplicationService)
  _preRegData = inject(RegStoreService)
  cd = inject(ChangeDetectorRef)
  router = inject(Router)

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


  constructor(
    private spinner: NgxSpinnerService,
    private alertService: NotificationsService,

  ) {
    this._widgetService.sidebarState$.subscribe((state: sidebarStateDTO) => {
      this.sidebarVisible = state.isvisible;
    })
    this._formStepService.formsteps$.subscribe((step: formstepDTO) => {
      this.formStepStatus = step;
    })

    this._formStepService.personalform$.subscribe((data: TPersonalDetailDTO | null) => {
      if (data != null) {
        this._personalFormData = data;
      }
    })
    this._formStepService.nextofkinform$.subscribe((data: TNextOfKinDTO | null) => {
      if (data != null) {
        this._nextofkinFormData = data;
      }
    })
    this._formStepService.uploadFile$.subscribe((data: TUploadFile | null) => {
      if (data != null) {
        this._uploadFileFormData = data;
      }
    })
    this._formStepService.academicHistory$.subscribe((data: TAcademicHistory[] | null) => {
      if (data != null) {
        this._academicHistoryFormData = data;
      }
    })
    this._formStepService.olevelResult$.subscribe((data: TOLevelResult[] | null) => {
      if (data != null) {
        this._olevelFormData = data;
      }
    })

  }
  ngOnInit(): void {
    this._appservice.registrationData().subscribe({
      next: (data) => {
        this._preRegData.setpreRegData(data);
      },
      error: (err) => {

      }
    })

    this._appservice.countries().subscribe({
      next: (data) => {
        // this.countries = data.data;
        this._preRegData.setCountryData(data);
      },
      error: (err) => {

      }
    })
    this._appservice.states().subscribe({
      next: (data) => {
        // this.countries = data.data;
        this._preRegData.setStateData(data);
      },
      error: (err) => {

      }
    })

    this._preRegData.stateData$.subscribe(data => {
      if (data != undefined) {
        this._states = data.data;
      }
    })
    this._preRegData.lgaData$.subscribe(data => {
      if (data != undefined) {
        this._lgas = data;
      }
    })

  }


  saveAndMoveToStep(nextStep: number, saveFunction: () => Promise<void>) {
    saveFunction()
      .then(() => {
        // Move to the next step if save succeeds
        this.activateStep(nextStep);
      })
      .catch((error) => {
        console.error('Save failed:', error);
        // Optionally, show an error message to the user
      });
  }

  // Example method to activate a specific step
  activateStep(step: number) {
    // Use your stepper's callback to navigate
    this.activeStepIndex = step; // Or call activateCallback(step) if provided by PrimeNG
  }

  savePersonalDetails(): Promise<void> {
    this.spinner.show("personal");
    let _pd = this.buildPersonalDetailObj();
    return new Promise((resolve, reject) => {

      this.app_no = sessionStorage.getItem("APP_NO") || "";
      firstValueFrom(this._appservice.personalDetails(this.app_no, _pd))
        .then((data) => {
          // this.applicantStore.setApplicatStore(_pd, "personaldetail");
          // this.regDataStore.setRegDataStore(data);
          this.alertService.success("Personal Detail", "Save Successfully");
          this.spinner.hide("personal");
          resolve();

        })
        .catch(err => {
          let erMsg = "Unable to Save";
          if (err.error && err.error?.errors?.non_field_errors) {
            erMsg = err.error.errors.non_field_errors[0];
          } else
            if (err.error && err.error.non_field_errors) {
              erMsg = err.error.non_field_errors[0];
            } else {
              erMsg = err.error.message;
            }

          this.alertService.error("Personal Detail", erMsg);
          this.spinner.hide("personal");
          reject(erMsg);

        })

    });
  }

  saveNextOfKinDetails(): Promise<void> {
    this.spinner.show("nextofkin");
    let _nk = this.buildNextOfKinDetailObj();
    return new Promise((resolve, reject) => {

      this.app_no = sessionStorage.getItem("APP_NO") || "";
      firstValueFrom(this._appservice.personalDetails(this.app_no, { primary_parent_or_guardian: _nk }))
        .then((data) => {
          // this.applicantStore.setApplicatStore(_pd, "personaldetail");
          // this.regDataStore.setRegDataStore(data);
          this.alertService.success("Next Of Kin Details", "Save Successfully");
          this.spinner.hide("nextofkin");
          resolve();

        })
        .catch(err => {
          let erMsg = "Unable to Save";
          if (err.error && err.error?.errors?.non_field_errors) {
            erMsg = err.error.errors.non_field_errors[0];
          } else
            if (err.error && err.error.non_field_errors) {
              erMsg = err.error.non_field_errors[0];
            } else {
              erMsg = err.error.message;
            }

          this.alertService.error("Next Of Kin Details", erMsg);
          this.spinner.hide("nextofkin");
          reject(erMsg);

        })

    });
  }

  saveAcademicHistory(): Promise<void> {
    this.spinner.show("academic");
    let _ad = this.buildAcademicDetailObj();
    let _ol = this.buildolevelDetailObj();
    return new Promise((resolve, reject) => {

      this.app_no = sessionStorage.getItem("APP_NO") || "";
      console.log("Academic History", _ad);
      console.log("O Level Result", _ol);
      firstValueFrom(this._appservice.personalDetails(this.app_no, { academic_history: _ol, o_level_result: _ad }))
        .then((data) => {
          // this.applicantStore.setApplicatStore(_pd, "personaldetail");
          // this.regDataStore.setRegDataStore(data);
          this.alertService.success("Academic Details", "Save Successfully");
          this.spinner.hide("academic");
          resolve();

        })
        .catch(err => {
          let erMsg = "Unable to Save";
          if (err.error && err.error?.errors?.non_field_errors) {
            erMsg = err.error.errors.non_field_errors[0];
          } else
            if (err.error && err.error.non_field_errors) {
              erMsg = err.error.non_field_errors[0];
            } else {
              erMsg = err.error.message;
            }

          this.alertService.error("Academic Details", erMsg);
          this.spinner.hide("academic");
          reject(erMsg);

        })

    });
  }
  buildolevelDetailObj() {
    let _allAcHistory: TAcademicHistory[] = [];
    if (this._academicHistoryFormData != null) {
      // return this._academicHistoryFormData;
      this._academicHistoryFormData.forEach((val, i) => {
        if (val.institution != "") {
          _allAcHistory.push({
            institution: val.institution,
            certificate_type: val.certificate_type,
            from_date: val.from_date,
            to_date: val.to_date
          })
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
        })
      })



    }
    return _allOlevel;
  }

  saveDocumentUpload(): Promise<void> {
    this.spinner.show("documentupload");
    let _up = this.buildDocumentUploadObj();
    let _ad = this.buildAcademicDetailObj();
    let _ol = this.buildolevelDetailObj();
    _ad[0].file = _up?.olevels[0];

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
          // this.applicantStore.setApplicatStore(_pd, "personaldetail");
          // this.regDataStore.setRegDataStore(data);
          this.alertService.success("Document Upload", "Save Successfully");
          this.spinner.hide("uploads");
          resolve();

        })
        .catch(err => {
          // let erMsg = "Unable to Save";
          // if (err.error && err.error?.errors?.non_field_errors) {
          //   erMsg = err.error.errors.non_field_errors[0];
          // } else
          //   if (err.error && err.error.non_field_errors) {
          //     erMsg = err.error.non_field_errors[0];
          //   } else {
          //     erMsg = err.error.message;
          //   }

          this.alertService.error("Document Upload", "Uploads Failed");
          this.spinner.hide("uploads");
          // reject(erMsg);

          // ErrorHandler.handle(err);

        })

    });
  }
  buildDocumentUploadObj() {
    if (this._uploadFileFormData != null) {
      return this._uploadFileFormData;
    }
    return;
  }

  buildPersonalDetailObj() {
    if (this._personalFormData != null) {
      let result = false;
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
        dob: this._personalFormData.dateOfBirth,
        gender: this._personalFormData.gender,
        lga: this._lgas?.filter(f => f.id == +this._personalFormData!.localGovernment)[0].name,
        state_of_origin: this._states?.filter(f => f.id == +this._personalFormData!.stateOfOrigin)[0].name,

      }

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


      }

      return _nokDetail;

    }

  }

  confirm() {
    this.visible = true;
    this.cd.detectChanges();
  }
  done() {
    this.visible=false;
    setTimeout(() => {
      this.router.navigateByUrl("/pages/dashboard")
    }, 2000);
    }
  destroyed($event: any) {

  }
}
