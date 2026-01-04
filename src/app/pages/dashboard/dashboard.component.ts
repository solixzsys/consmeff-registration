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

@Component({
    selector: 'app-dashboard',
    imports: [TraceabilityModule,ProgrammeComponent,FormsModule],
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
    title: string = "Choose the programme  you are applying for";

    actionButtons = [
        // { id: 'dashboard', icon: 'pi pi-chart-line', name: 'Analytics', tooltip: 'Analytics Dashboard',link:'' },
        // { id: 'reports', icon: 'pi pi-file-pdf', name: 'Reports', tooltip: 'Generate Reports',link:'' },
        { id: 'continue', icon: 'pi pi-arrow-right', name: 'Continue', tooltip: 'Continue', link: '/setting/settings' },
        // { id: 'notifications', icon: 'pi pi-bell', name: 'Alerts', tooltip: 'Notifications',link:'' },
        // { id: 'profile', icon: 'pi pi-user', name: 'Profile', tooltip: 'User Profile',link:'' }
    ];


    constructor(private cd: ChangeDetectorRef,
        private appservice:ApplicationService,
    private regstore:RegStoreService,
    ) {

    }

    
    
      async dataIntitialization(): Promise<boolean> {
    
        let result = false;
        let app_no = sessionStorage.getItem("APP_NO") || "";
        if (app_no != "") {
          await firstValueFrom(this.appservice.registratantData(app_no))
            .then(async (data) => {
              console.log("fetching app data ............................");
              
    
              this.regstore.setRegData(data);
            
              this.backendProgramme=data.data?.program;
              result = true;
            })
            .catch((err) => {
              result = false;
            })
        }
    
        return result;
      }

    ngOnInit(): void {
        const token = sessionStorage.getItem("key") || '';
        if (token != '') {
            let email = this.jwtservices.getUserEmail(token)!;
            this.user = email.split("@")[0];
        }
        // Start animation sequence after 5 seconds
        setTimeout(() => {
            this.startWelcomePanelAnimation();
            this.dataIntitialization();
        }, 2000);
    }

    private startWelcomePanelAnimation(): void {
        // Step 1: Show panel and start sliding in from right
        this.showPanel = true;

        // Step 2: Show welcome text after panel starts appearing
        setTimeout(() => {
            this.showWelcomeText = true;
        }, 500);

        // Step 3: Show action buttons with staggered animation
        setTimeout(() => {
            this.showActionButtons = true;
        }, 1000);
    }

    onActionClick(actionId: string): void {
        console.log(`Action clicked: ${actionId}`);
        // Handle action button clicks here
        switch (actionId) {
            case 'dashboard':
                // this.router.navigate(['/dashboard/analytics']);
                break;
            case 'reports':
                // Open reports generation
                break;
            case 'settings':
                this.router.navigate(['/setting/settings']);
                break;
            case 'notifications':
                // Show notifications panel
                break;
            case 'profile':
                // Navigate to user profile
                break;
        }
    }

    closePanel(): void {
        // Reverse animation sequence
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

    

  courseUpdated(event: string) {
    this.selectedCourse = event;
    this.title=event;
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
