import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';

// Services
import { FormService } from '../../../services/form.service';
import { RegStoreService } from '../../../../services/regstore.service';
import { formstepDTO } from '../../../../data/application/form.dto';
import { ApplicationService } from '../../../../services/application.service';
import { LGA, RegistrantDataDTO } from '../../../../data/application/registrantdatadto';
import { Countries, States } from '../../../../data/application/location.dto';
import { parseAddress } from '../../../../utility/addressparser';
import { TraceabilityModule } from '../../../../shared/traceability.module';

@Component({
  selector: 'app-nextofkin',
  standalone: true,
  imports: [
    TraceabilityModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    RadioButtonModule
  ],
  templateUrl: './nextofkin.component.html',
  styleUrl: './nextofkin.component.scss'
})
export class NextofkinComponent {
  _formStepService = inject(FormService);
  regstore = inject(RegStoreService);
  appservice = inject(ApplicationService);
  
  formStepStatus: formstepDTO = {
    academicValid: false,
    docuplodValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  };

  nextofkinForm!: FormGroup;
  backendRegistrationData!: RegistrantDataDTO;
  
  genderOptions = ['Male', 'Female', 'Other'];
  
  nationalityOptions: Countries[] | undefined = undefined;
  stateOptions: States[] | undefined = undefined;
  localGovOptions: LGA[] | undefined = undefined;
  residentialLocalGovernment: LGA[] | undefined = undefined;
  titleOptions: string[] = ['Mr', 'Mrs', 'Chief'];
  relationshipOption: string[] = ['Parent', 'Uncle'];

  // Transformed options for PrimeNG dropdowns
  titleDropdownOptions: any[] = [];
  relationshipDropdownOptions: any[] = [];
  nationalityDropdownOptions: any[] = [];
  stateDropdownOptions: any[] = [];
  localGovDropdownOptions: any[] = [];

  private formInitialized = false;

  constructor(private fb: FormBuilder) {
    this._formStepService.formsteps$.subscribe((step: formstepDTO) => {
      this.formStepStatus = step;
    });

    this.regstore.countryData$.subscribe(data => {
      if (data != undefined) {
        this.nationalityOptions = data.data;
        this.nationalityDropdownOptions = data.data.map(country => ({
          label: country.name,
          value: country.name
        }));
      }
    });

    this.regstore.stateData$.subscribe(data => {
      if (data != undefined) {
        this.stateOptions = data.data;
        this.stateDropdownOptions = data.data.map(state => ({
          label: state.name,
          value: state.id
        }));
      }
    });

    this.regstore.preRegData$.subscribe(data => {
      if (data != null) {
        this.titleOptions = data.titles;
        this.titleDropdownOptions = data.titles.map(title => ({
          label: title,
          value: title
        }));
        
        this.relationshipOption = data.relationship_types;
        this.relationshipDropdownOptions = data.relationship_types.map(rel => ({
          label: rel,
          value: rel
        }));
      }
    });

    this.regstore.regData$.subscribe(data => {
      if (data != null) {
        this.backendRegistrationData = data;
        console.log(this.backendRegistrationData);
        this.initializeForm();
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  initializeForm() {
    let data = this.backendRegistrationData?.data?.primary_parent_or_guardian;
    
    this.nextofkinForm = this.fb.group({
      title: [data?.title ?? null, Validators.required],
      firstname: [data?.first_name ?? '', Validators.required],
      lastname: [data?.last_name ?? '', Validators.required],
      middlename: [data?.other_names ?? ''],
      gender: [data?.gender ?? '', Validators.required],
      relationship: [null],
      occupation: [data?.occupation ?? '', Validators.required],
      phonenumber: [data?.phone_number ?? '', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      email: [data?.email ?? '', [Validators.email]],
      nationality: [data?.nationality ?? null, Validators.required],
      stateOfOrigin: [null, Validators.required],
      localGovernment: [null, Validators.required],
      houseNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      landmark: ['', Validators.required],
      areaTown: ['', Validators.required],
      residentialState: [null, Validators.required],
      residentialLocalGovernment: [null, Validators.required],
    });

    this.formInitialized = true;

    // Set dropdown values with delays for cascading dropdowns
    if (data) {
      setTimeout(() => {
        if (data.state_of_origin) {
          const stateId = this.getStateIDByName(data.state_of_origin);
          if (stateId) {
            this.nextofkinForm.controls['stateOfOrigin'].setValue(stateId);
            this.nextofkinForm.controls['residentialState'].setValue(stateId);
          }
        }
      }, 1000);

      setTimeout(() => {
        if (data.lga) {
          const lgaId = this.getLocalGovtIDByName(data.lga);
          if (lgaId) {
            this.nextofkinForm.controls['localGovernment'].setValue(lgaId);
            this.nextofkinForm.controls['residentialLocalGovernment'].setValue(lgaId);
          }
        }
      }, 2000);

      if (data?.residential_address != null && data?.residential_address != "") {
        let parser = parseAddress(data?.residential_address!);
        this.nextofkinForm.controls["houseNumber"].setValue(parser.houseNumber);
        this.nextofkinForm.controls["streetName"].setValue(parser.streetName);
        this.nextofkinForm.controls["landmark"].setValue(parser.landmark);
        this.nextofkinForm.controls["areaTown"].setValue(parser.city);
      }
    }
  }

  setupFormSubscriptions() {
    if (!this.nextofkinForm) return;

    this.nextofkinForm.valueChanges.subscribe(val => {
      if (this.nextofkinForm.valid) {
        this.formStepStatus.nextofkinValid = true;
        console.log(this.nextofkinForm.value);
        this._formStepService.setNextOfKinFormData(this.nextofkinForm.value);
        this._formStepService.setFormSteps(this.formStepStatus);
      } else {
        this.formStepStatus.nextofkinValid = false;
        this._formStepService.setFormSteps(this.formStepStatus);
      }
    });

    this.nextofkinForm.controls["stateOfOrigin"].valueChanges.subscribe((val: number) => {
      if (val > 0) {
        this.nextofkinForm.controls["localGovernment"].setValue(null);
        this.getLocalGovtByStateID(val);
        this.nextofkinForm.controls["residentialState"].setValue(val);
      }
    });

    this.nextofkinForm.controls["localGovernment"].valueChanges.subscribe((val: number) => {
      if (val > 0) {
        this.nextofkinForm.controls["residentialLocalGovernment"].setValue(val);
      }
    });
  }

  getLocalGovtByStateID(val: number) {
    this.appservice.lgas(val).subscribe(data => {
      if (data != undefined) {
        this.localGovOptions = data.data;
        this.localGovDropdownOptions = data.data.map(lga => ({
          label: lga.name,
          value: lga.id
        }));
        this.regstore.setLGAData(this.localGovOptions);
      }
    });
  }

  getStateIDByName(val: string): number | null {
    if (val && this.stateOptions) {
      const state = this.stateOptions.find(s => s.name === val);
      return state?.id ?? null;
    }
    return null;
  }

  getLocalGovtIDByName(val: string): number | null {
    if (val && this.localGovOptions) {
      const lga = this.localGovOptions.find(l => l.name === val);
      return lga?.id ?? null;
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.nextofkinForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.nextofkinForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['pattern']) return 'Please enter a valid phone number (10-15 digits)';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      title: 'Title',
      firstname: 'First Name',
      lastname: 'Last Name',
      gender: 'Gender',
      relationship: 'Relationship',
      occupation: 'Occupation',
      phonenumber: 'Phone Number',
      email: 'Email',
      nationality: 'Nationality',
      stateOfOrigin: 'State of Origin',
      localGovernment: 'Local Government',
      houseNumber: 'House Number',
      streetName: 'Street Name',
      landmark: 'Landmark',
      areaTown: 'Area/Town',
      residentialState: 'Residential State',
      residentialLocalGovernment: 'Residential Local Government'
    };
    return labels[fieldName] || fieldName;
  }
}