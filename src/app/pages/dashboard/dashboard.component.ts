import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { JwtService } from '../../services/jwt.service';
import { Router } from '@angular/router';
import { TraceabilityModule } from '../../shared/traceability.module';
import { Program } from '../../data/application/admission.dto';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ProgrammeComponent } from '../../widgets/admission/programme/programme.component';
import { firstValueFrom } from 'rxjs';
import { ApplicationService } from '../../services/application.service';
import { RegStoreService } from '../../services/regstore.service';
import { RegistrantDataDTO } from '../../data/application/registrantdatadto';

interface TimelineStage {
    title: string;
    description: string;
    icon: string;
    status: 'completed' | 'current' | 'pending';
    statusText: string;
    date?: string;
}

interface Notice {
    title: string;
    message: string;
    icon: string;
    priority: 'high' | 'normal';
    time: string;
}

@Component({
    selector: 'app-dashboard',
    imports: [TraceabilityModule, ProgrammeComponent, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class Dashboard {
    jwtservices = inject(JwtService);
    router = inject(Router);
    showPanel = false;
    showWelcomeText = false;
    showActionButtons = false;
    user: string = "user";
    visible: boolean = false;
    guidelinesAccepted = false;

    backendProgramme: Program | undefined;
    guideLineForm: FormGroup = new FormGroup({
        acceptguide: new FormControl()
    });
    guidelineVisible: boolean = false;
    selectedCourse: string = "";
    title: string = "Choose the programme you are applying for";

    // Dashboard Data
    applicationStatus: string = 'In Progress';
    paymentStatus: string = 'Pending';
    currentStage: string = 'Registration';
    appliedDate: string = 'Jan 10, 2026';
    applicationNumber: string = '';
    programmeName: string = 'Basic Midwifery Programme';
    academicSession: string = '2025/2026';
    entryMode: string = 'UTME';
    registrationStage="";

    stages: TimelineStage[] = [
        {
            title: 'Registration',
            description: 'Complete your application form with all required details',
            icon: 'pi pi-user-plus',
            status: 'current',
            statusText: 'In Progress',
            date: 'Jan 10, 2026'
        },
        {
            title: 'Payment',
            description: 'Pay the application fee of ₦15,000',
            icon: 'pi pi-wallet',
            status: 'pending',
            statusText: 'Pending'
        },
        {
            title: 'Credential Review',
            description: 'Your documents will be verified by our admission team',
            icon: 'pi pi-file-check',
            status: 'pending',
            statusText: 'Not Started'
        },
        {
            title: 'Entrance Test',
            description: 'Shortlisted candidates will be invited for entrance examination',
            icon: 'pi pi-pencil',
            status: 'pending',
            statusText: 'Not Started'
        },
        {
            title: 'Admission Offer',
            description: 'Successful candidates will receive admission letters',
            icon: 'pi pi-check-circle',
            status: 'pending',
            statusText: 'Not Started'
        }
    ];

    notices: Notice[] = [
        {
            title: 'Complete Your Payment',
            message: 'Please complete your application fee payment to proceed to the next stage.',
            icon: 'pi pi-exclamation-triangle',
            priority: 'high',
            time: '2 hours ago'
        },
        {
            title: 'Document Upload Reminder',
            message: 'Ensure all required documents are uploaded before submission.',
            icon: 'pi pi-info-circle',
            priority: 'normal',
            time: '1 day ago'
        }
    ];

    actionButtons = [
        { id: 'continue', icon: 'pi pi-arrow-right', name: 'Continue', tooltip: 'Continue', link: '/setting/settings' },
    ];

    constructor(
        private cd: ChangeDetectorRef,
        private appservice: ApplicationService,
        private regstore: RegStoreService,
    ) { }

    async dataIntitialization(): Promise<boolean> {
        let result = false;
        let app_no = sessionStorage.getItem("APP_NO") || "";
        if (app_no != "") {
            await firstValueFrom(this.appservice.registratantData(app_no))
                .then(async (data) => {
                    console.log("fetching app data ............................");
                    this.regstore.setRegData(data);
                    this.backendProgramme = data.data?.program;
                    
                    // Update dashboard data from backend
                    this.updateDashboardFromBackend(data);
                    this.setRegistrationStage(data);
                    result = true;
                })
                .catch((err) => {
                    result = false;
                })
        }
        return result;
    }
    setRegistrationStage(data: RegistrantDataDTO) {
        let _data=data?.data;
        if(_data != undefined && _data != null){
            if(
                _data.residential_address !=null && 
                _data.primary_parent_or_guardian !=null && 
                _data.academic_history !=null &&
                _data.o_level_result !=null &&
                _data.utme_result !=null &&
                _data.certificate_of_birth !=null &&
                _data.passport_photo !=null 
            ){
                this.registrationStage="Completed";
                this.actionButtons=[];
            }else{
                this.registrationStage="In Progress";
            }

            
        }
    }

    updateDashboardFromBackend(data: any): void {
        // Update metrics from backend data
        if (data.data) {
            this.applicationNumber = data.data.applicationNumber || this.applicationNumber;
            this.programmeName = data.data.program?.name || this.programmeName;
            this.paymentStatus = sessionStorage.getItem("PAYMENT_STATUS") || this.paymentStatus;
            
            // Update timeline based on backend status
            this.updateTimelineStatus();
        }
    }

    updateTimelineStatus(): void {
        const paymentStatus = sessionStorage.getItem("PAYMENT_STATUS") || "";
        
        if (paymentStatus === "Paid") {
            this.stages[0].status = 'completed';
            this.stages[0].statusText = 'Completed';
            this.stages[1].status = 'completed';
            this.stages[1].statusText = 'Completed';
            this.stages[2].status = 'current';
            this.stages[2].statusText = 'Under Review';
            this.currentStage = 'Credential Review';
            this.applicationStatus = 'Under Review';
            
            // Remove payment notice
            this.notices = this.notices.filter(n => n.title !== 'Complete Your Payment');
        }
    }

    ngOnInit(): void {
        const name = sessionStorage.getItem("user_name") || '';
        const token = sessionStorage.getItem("token") || '';
        if (name != '') {
            // let email = this.jwtservices.getUserEmail(token)!;
            this.user = name;
            this.applicationNumber = sessionStorage.getItem("APP_NO") || '';
        }
        
        // Initialize data immediately to prevent blank screen
        this.dataIntitialization();
        
        // Start welcome panel animation after a short delay
        setTimeout(() => {
            this.startWelcomePanelAnimation();
        }, 500);
    }

    private startWelcomePanelAnimation(): void {
        this.showPanel = true;
        setTimeout(() => {
            this.showWelcomeText = true;
        }, 500);
        setTimeout(() => {
            this.showActionButtons = true;
        }, 1000);
    }

    calculateProgress(): number {
        const completed = this.stages.filter(s => s.status === 'completed').length;
        return Math.round((completed / this.stages.length) * 100);
    }

    onActionClick(actionId: string): void {
        console.log(`Action clicked: ${actionId}`);
        switch (actionId) {
            case 'settings':
                this.router.navigate(['/setting/settings']);
                break;
        }
    }

    closePanel(): void {
        this.showActionButtons = false;
        setTimeout(() => {
            this.showWelcomeText = false;
        }, 200);
        setTimeout(() => {
            this.showPanel = false;
        }, 400);
    }

    showDialog() {
        let p_status = sessionStorage.getItem("PAYMENT_STATUS") || "";
        if (p_status == "Paid") {
            this.router.navigateByUrl("/pages/admissionform")
            return;
        }
        this.visible = true;
        this.cd.detectChanges();
    }

    viewApplication() {
        this.router.navigateByUrl("/pages/admissionform");
    }

    downloadForm() {
        // Implement download functionality
        console.log("Downloading application form...");
    }

    courseUpdated(event: string) {
        this.selectedCourse = event;
        this.title = event;
    }

    dismissGuideline() {
        if (!this.guidelinesAccepted) return;
        this.guidelineVisible = false;
        setTimeout(() => {
            this.router.navigateByUrl('/pages/payment');
        }, 200);
    }

    showGuideline(event: boolean) {
        this.visible = !event;
        setTimeout(() => {
            this.guidelineVisible = event;
        }, 500);
    }
}