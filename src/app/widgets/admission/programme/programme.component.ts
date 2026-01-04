import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { AppInitResponseDTO, DepartmentsDTO, OpenApplicationDTO, Program } from '../../../data/application/admission.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RegStoreService } from '../../../services/regstore.service';
import { FormService } from '../../services/form.service';
import { RegistrantDataDTO } from '../../../data/application/registrantdatadto';
import { MessageService } from 'primeng/api';
import { TraceabilityModule } from '../../../shared/traceability.module';

@Component({
  selector: 'app-programme',
  templateUrl: './programme.component.html',
  styleUrl: './programme.component.scss',
  imports: [TraceabilityModule],
  providers: [MessageService]
})
export class ProgrammeComponent implements OnInit {
  programmes!: OpenApplicationDTO;
  departments!: DepartmentsDTO;
  _formStepService = inject(FormService);
  regstore = inject(RegStoreService);

  courseForm: FormGroup = new FormGroup({
    midwifery: new FormControl(),
    nursing: new FormControl()
  });

  deptForm: FormGroup = new FormGroup({
    midwifery: new FormControl(),
    nursing: new FormControl()
  });

  selectedDept: number = 0;
  selectedCourse: number = 0;
  @Output() selectedDeptChanged = new EventEmitter<string>();

  showGuideline: boolean = false;
  @Output() showGuidelineStatus = new EventEmitter<boolean>();
  appInitResp!: AppInitResponseDTO;
  toShow: number = 0;
  busy: boolean = false;
  @Input() backendProgramme: Program | undefined;

  constructor(
    private appservice: ApplicationService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) {
    this.courseForm.controls['nursing'].valueChanges.subscribe((val) => {
      this.selectedCourse = val;
      setTimeout(() => {
        this.courseForm.controls['midwifery'].setValue(null, { emitEvent: false });
      }, 200);
    });

    this.courseForm.controls['midwifery'].valueChanges.subscribe((val) => {
      this.selectedCourse = val;
      setTimeout(() => {
        this.courseForm.controls['nursing'].setValue(null, { emitEvent: false });
      }, 200);
    });

    this.deptForm.controls['nursing'].valueChanges.subscribe((val) => {
      this.selectedDept = val;
      setTimeout(() => {
        this.deptForm.controls['midwifery'].setValue(null, { emitEvent: false });
      }, 200);
    });

    this.deptForm.controls['midwifery'].valueChanges.subscribe((val) => {
      this.selectedDept = val;
      setTimeout(() => {
        this.deptForm.controls['nursing'].setValue(null, { emitEvent: false });
      }, 200);
    });
  }

  ngOnInit(): void {
    this.appservice.openApplications().subscribe({
      next: (data) => {
        this.programmes = data;
        this.initializeForm();
      },
      error: ((err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load programmes',
          life: 5000
        });
      })
    });
  }

  initializeForm() {
    if (this.backendProgramme != undefined) {
      // Initialize with backend data if available
      const programName = this.backendProgramme.name.toLowerCase();
      if (this.courseForm.controls[programName]) {
        this.courseForm.controls[programName].setValue(this.backendProgramme.id);
        this.selectedCourse = this.backendProgramme.id;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cd.detectChanges();
  }

  selectProgramme(id: number) {
    this.selectedCourse = id;
    // Update form control based on the selected programme
    const programme = this.programmes.data.find(p => p.program.id === id);
    if (programme) {
      const controlName = programme.program.name.toLowerCase();
      this.courseForm.patchValue({
        midwifery: null,
        nursing: null,
        [controlName]: id
      });
    }
  }

  selectDepartment(id: number) {
    this.selectedDept = id;
    // Update form control based on the selected department
    const dept = this.departments.data.find(d => d.id === id);
    if (dept) {
      const controlName = dept.name.toLowerCase();
      this.deptForm.patchValue({
        midwifery: null,
        nursing: null,
        [controlName]: id
      });
    }
  }

  async deptChoice() {
    if (this.selectedDept === 0 || this.selectedCourse === 0) return;

    this.busy = true;
    const payload = {
      application_id: this.selectedCourse,
      department_id: this.selectedDept
    };

    await firstValueFrom(this.appservice.initializeApplication(payload))
      .then((source: AppInitResponseDTO) => {
        this.appInitResp = source;
        const app_no = this.appInitResp.data.application_no;

        if (!app_no) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to initialize application',
            life: 5000
          });
          this.busy = false;
          return;
        }

        sessionStorage.setItem('APP_NO', app_no);

        const regPartial: RegistrantDataDTO = {
          data: {
            id: this.appInitResp.data.id,
            application_no: this.appInitResp.data.application_no,
            first_name: this.appInitResp.data.first_name,
            last_name: this.appInitResp.data.last_name,
            other_names: this.appInitResp.data.other_names,
            email: this.appInitResp.data.email,
            phone_number: this.appInitResp.data.phone_number,
            alt_phone_number: this.appInitResp.data.alt_phone_number,
            program: this.appInitResp.data.program,
            department: this.appInitResp.data.department,
            session: this.appInitResp.data.session,
            gender: '',
            certificate_of_birth: undefined,
            o_level_result: [],
            certificate_of_origin: undefined,
            passport_photo: undefined,
            payment_slip: undefined,
            marital_status: '',
            disability: '',
            payment_status: '',
            utme_result: undefined,
            residential_address: undefined,
            correspondence_address: undefined,
            nationality: '',
            dob: '',
            state_of_origin: '',
            lga: '',
            primary_parent_or_guardian: undefined,
            secondary_parent_or_guardian: undefined,
            approval_status: '',
            payment_record: null,
            deleted_at: null,
            created_at: undefined,
            updated_at: undefined
          }
        };

        this.regstore.setRegData(regPartial);
        this.busy = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Application initialized successfully',
          life: 3000
        });

        setTimeout(() => {
          this.showGuidelineStatus.emit(true);
        }, 1000);
      })
      .catch(err => {
        this.busy = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to initialize application',
          life: 5000
        });
      });
  }

  programmeChoice() {
    if (this.selectedCourse === 0) return;

    this.getDepartment();
  }

  getDepartment() {
    this.busy = true;
    this.appservice.departments(this.selectedCourse).subscribe({
      next: (data) => {
        this.departments = data;
        this.selectedDeptChanged.emit('Choose the department you are applying for');
        this.toShow = 1;
        this.busy = false;
      },
      error: ((err: HttpErrorResponse) => {
        this.busy = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load departments',
          life: 5000
        });
      })
    });
  }
}