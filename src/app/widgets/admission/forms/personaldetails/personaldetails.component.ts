import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FloatLabelModule } from 'primeng/floatlabel';

// Services
import { FormService } from '../../../services/form.service';
import { RegStoreService } from '../../../../services/regstore.service';
import { ApplicationService } from '../../../../services/application.service';
import { formstepDTO } from '../../../../data/application/form.dto';
import { LGA, RegistrantDataDTO } from '../../../../data/application/registrantdatadto';
import { Countries, States } from '../../../../data/application/location.dto';

@Component({
  selector: 'app-personaldetails',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule,
    FloatLabelModule
  ],
  templateUrl: './personaldetails.component.html',
  styleUrl: './personaldetails.component.scss',
  providers: []
})
export class PersonaldetailsComponent {
  _formStepService = inject(FormService);
  regstore = inject(RegStoreService);
  appservice = inject(ApplicationService);

  formStepStatus: formstepDTO = {
    academicValid: false,
    docuplodValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  };

  personalInfoForm!: FormGroup;
  backendRegistrationData!: RegistrantDataDTO;
  
  maritalStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' }
  ];
  
  genderOptions = ['Male', 'Female', 'Other'];
  
  disabilityOptions = ['Yes', 'No', 'Prefer not to say'];

  nationalityOptions: Countries[] | undefined = undefined;
  stateOptions: States[] | undefined = undefined;
  localGovOptions: LGA[] | undefined = undefined;
  residentialLocalGovernment: LGA[] | undefined = undefined;

  // Transformed options for PrimeNG dropdowns
  nationalityDropdownOptions: any[] = [];
  stateDropdownOptions: any[] = [];
  localGovDropdownOptions: any[] = [];
  residentialLGADropdownOptions: any[] = [];

  // Date constraints
  maxDate: Date = new Date();
  minDate: Date = new Date(1940, 0, 1);

  private formInitialized = false;

  constructor(private fb: FormBuilder) {
    this.setupSubscriptions();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private setupSubscriptions() {
    this._formStepService.formsteps$.subscribe((step: formstepDTO) => {
      this.formStepStatus = step;
    });

    this.regstore.countryData$.subscribe(data => {
      if (data?.data) {
        this.nationalityOptions = data.data;
        this.nationalityDropdownOptions = data.data.map(country => ({
          label: country.name,
          value: country.name
        }));
        this.setDropdownValuesIfReady();
      }
    });

    this.regstore.stateData$.subscribe(data => {
      if (data?.data) {
        this.stateOptions = data.data;
        this.stateDropdownOptions = data.data.map(state => ({
          label: state.name,
          value: state.id
        }));
        this.setDropdownValuesIfReady();
      }
    });

    this.regstore.regData$.subscribe(data => {
      if (data) {
        this.backendRegistrationData = data;
        console.log(this.backendRegistrationData);
        this.initializeForm();
      }
    });
  }

  initializeForm() {
    const data = this.backendRegistrationData?.data;
    
    this.personalInfoForm = this.fb.group({
      // Personal Information
      firstname: [data?.first_name ?? '', Validators.required],
      lastname: [data?.last_name ?? '', Validators.required],
      middlename: [data?.other_names ?? ''],
      email: [data?.email ?? '', [Validators.required, Validators.email]],
      phonenumber: [data?.phone_number ?? '', [Validators.required, Validators.pattern(/^\+?\(?[0-9]{1,4}\)?[-.\s]?[0-9]{1,15}$/)]],
      alternativePhoneNumber: [data?.alt_phone_number ?? '', Validators.pattern(/^\+?\(?[0-9]{1,4}\)?[-.\s]?[0-9]{1,15}$/)],
      dateOfBirth: [data?.dob ? new Date(data.dob) : null, Validators.required],
      maritalStatus: [data?.marital_status ?? null, Validators.required],
      gender: [data?.gender ?? '', Validators.required],
      nationality: [null, Validators.required],
      stateOfOrigin: [null, Validators.required],
      localGovernment: [null, Validators.required],
      disability: [data?.disability?.toLowerCase().includes("no") ? 'No' : '', Validators.required],
      disabilityDetails: [''],
      // Residential Information
      houseNumber: [this.getAddressPart(data?.residential_address?.address, 0), Validators.required],
      streetName: [data?.residential_address?.street_name ?? '', Validators.required],
      landmark: [data?.residential_address?.land_mark ?? '', Validators.required],
      areaTown: [data?.residential_address?.city ?? '', Validators.required],
      residentialState: [null, Validators.required],
      residentialLocalGovernment: [null, Validators.required],
    });

    this.handleDisabilityField(data);
    this.setupFormSubscriptions();
    this.formInitialized = true;
    
    this.setDropdownValuesIfReady();
  }

  private handleDisabilityField(data: any) {
    if (data?.disability) {
      if (data.disability.toLowerCase().includes("yes")) {
        this.personalInfoForm.get('disability')?.setValue("Yes");
        const details = data.disability.split(',').slice(1).join(',').trim();
        this.personalInfoForm.get('disabilityDetails')?.setValue(details || '');
      } else if (data.disability.toLowerCase().includes("no")) {
        this.personalInfoForm.get('disability')?.setValue("No");
      } else {
        this.personalInfoForm.get('disability')?.setValue(data.disability);
      }
    }
  }

  private setDropdownValuesIfReady() {
    if (!this.formInitialized || !this.backendRegistrationData?.data) return;

    const data = this.backendRegistrationData.data;

    // Set nationality
    if (this.nationalityOptions && data?.nationality) {
      const nationality = this.findNationalityByName(data.nationality);
      if (nationality) {
        this.personalInfoForm.get('nationality')?.setValue(nationality.name);
      }
    }

    // Set state of origin and trigger LGA loading
    if (this.stateOptions && data?.state_of_origin) {
      const stateId = this.getStateIDByName(data.state_of_origin);
      if (stateId) {
        this.personalInfoForm.get('stateOfOrigin')?.setValue(stateId);
      }
    }

    // Set residential state and trigger LGA loading
    if (this.stateOptions && data?.residential_address?.state?.id) {
      this.personalInfoForm.get('residentialState')?.setValue(data.residential_address.state.id);
    }
  }

  private findNationalityByName(nationalityName: string): Countries | undefined {
    return this.nationalityOptions?.find(option => 
      option.name?.toLowerCase() === nationalityName.toLowerCase()
    );
  }

  getLocalGovtByStateID(val: number) {
    this.appservice.lgas(val).subscribe(data => {
      if (data?.data) {
        this.localGovOptions = data.data;
        this.localGovDropdownOptions = data.data.map(lga => ({
          label: lga.name,
          value: lga.id
        }));
        this.regstore.setLGAData(this.localGovOptions);
        
        const backendLga = this.backendRegistrationData?.data?.lga;
        if (backendLga) {
          const lgaId = this.getLocalGovtIDByName(backendLga);
          if (lgaId) {
            this.personalInfoForm.get('localGovernment')?.setValue(lgaId);
          }
        }
      }
    });
  }

  getLocalGovtByStateID2(val: number) {
    this.appservice.lgas(val).subscribe(data => {
      if (data?.data) {
        this.residentialLocalGovernment = data.data;
        this.residentialLGADropdownOptions = data.data.map(lga => ({
          label: lga.name,
          value: lga.id
        }));
        
        const backendResLga = this.backendRegistrationData?.data?.residential_address?.lga?.id;
        if (backendResLga) {
          this.personalInfoForm.get('residentialLocalGovernment')?.setValue(backendResLga);
        }
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

  private getAddressPart(address: string | undefined, index: number): string {
    return address?.split(',')[index]?.trim() ?? '';
  }

  setupFormSubscriptions() {
    if (!this.personalInfoForm) return;

    // Disability field validation
    this.personalInfoForm.get('disability')?.valueChanges.subscribe((value) => {
      const disabilityDetailsControl = this.personalInfoForm.get('disabilityDetails');
      if (value === 'Yes') {
        disabilityDetailsControl?.setValidators(Validators.required);
      } else {
        disabilityDetailsControl?.clearValidators();
        disabilityDetailsControl?.setValue('');
      }
      disabilityDetailsControl?.updateValueAndValidity();
    });

    // State of origin changes
    this.personalInfoForm.get("stateOfOrigin")?.valueChanges.subscribe((val: number) => {
      if (val > 0) {
        this.personalInfoForm.get('localGovernment')?.setValue(null);
        this.getLocalGovtByStateID(val);
      }
    });

    // Residential state changes
    this.personalInfoForm.get("residentialState")?.valueChanges.subscribe((val: number) => {
      if (val > 0) {
        this.personalInfoForm.get('residentialLocalGovernment')?.setValue(null);
        this.getLocalGovtByStateID2(val);
      }
    });

    // Form validation and data setting
    this.personalInfoForm.valueChanges.subscribe(() => {
      if (this.personalInfoForm.valid) {
        this._formStepService.setPersonalFormData(this.personalInfoForm.value);
        this.formStepStatus.personalinfoValid = true;
        this._formStepService.setFormSteps(this.formStepStatus);
      } else {
        this.formStepStatus.personalinfoValid = false;
        this._formStepService.setFormSteps(this.formStepStatus);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.personalInfoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.personalInfoForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstname: 'First Name',
      lastname: 'Last Name',
      email: 'Email Address',
      phonenumber: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      maritalStatus: 'Marital Status',
      gender: 'Gender',
      nationality: 'Nationality',
      stateOfOrigin: 'State of Origin',
      localGovernment: 'Local Government',
      disability: 'Disability Status',
      disabilityDetails: 'Disability Details',
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