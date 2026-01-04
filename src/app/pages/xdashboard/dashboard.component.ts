import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { Program } from '../../data/application/admission.dto';
import { WidgetsService } from '../../widgets/services/widgets.service';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';
import { ApplicationService } from '../../services/application.service';
import { RegStoreService } from '../../services/regstore.service';
import { TraceabilityModule } from '../../shared/traceability.module';
import { Sidebar } from 'primeng/sidebar';
import { SidebarComponent } from '../../widgets/sidebar/sidebar.component';
import { TopbarComponent } from '../../widgets/topbar/topbar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports:[TraceabilityModule,SidebarComponent,TopbarComponent],
  styleUrl: './dashboard.component.scss'
})
export class xDashboardComponent implements OnInit {
  name = '';
  sidebarVisible = false;
  visible = false;
  guidelineVisible = false;
  guidelinesAccepted = false;
  dialogTitle = 'Choose the programme you are applying for';
  selectedCourse = '';
  backendProgramme: Program | undefined;

  // Dashboard Stats
  applicationProgress = 20;
  paymentStatus = 'Pending';
  paymentDate = '-';
  daysRemaining = 30;
  deadline = 'March 31, 2025';
  documentsUploaded = 2;
  totalDocuments = 5;

  // Chart Data
  chartData: any;
  chartOptions: any;
  chartPlugins: any;

  // Activities
  activities = [
    {
      title: 'Application Started',
      description: 'You created your application',
      date: 'Jan 15, 2025'
    },
    {
      title: 'Personal Information Completed',
      description: 'Personal details submitted successfully',
      date: 'Jan 16, 2025'
    },
    {
      title: 'Documents Uploaded',
      description: 'Birth certificate and passport uploaded',
      date: 'Jan 18, 2025'
    }
  ];

  _widgetService = inject(WidgetsService);
  router = inject(Router);
  appService = inject(ApplicationService);
  regStore = inject(RegStoreService);

  constructor() {
    this._widgetService.sidebarState$.subscribe((state: sidebarStateDTO) => {
      this.sidebarVisible = state.isvisible;
    });
  }

  ngOnInit() {
    this.name = sessionStorage.getItem('user_name') || '---';
    this.initChart();
    this.dataInitialization();
    this.loadPaymentStatus();
  }

  initChart() {
    this.chartData = {
      labels: ['Complete', 'Remaining'],
      datasets: [{
        data: [20, 80],
        backgroundColor: ['#2563eb', '#e5e7eb'],
        hoverBackgroundColor: ['#1d4ed8', '#d1d5db']
      }]
    };

    this.chartOptions = {
      cutout: '70%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      }
    };

    this.chartPlugins = [
      {
        id: 'centerText',
        beforeDraw: (chart: any) => {
          const ctx = chart.ctx;
          const dataset = chart.data.datasets[0];
          const total = dataset.data.reduce((sum: number, value: number) => sum + value, 0);
          const value = dataset.data[0];
          const percentage = ((value / total) * 100).toFixed(0);

          ctx.save();
          const fontSize = (chart.height / 8).toFixed(2);
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const centerX = chart.width / 2;
          const centerY = chart.height / 2;

          ctx.fillStyle = '#0F172A';
          ctx.fillText(`${percentage}%`, centerX, centerY - 10);
          
          ctx.font = `${(parseInt(fontSize) / 3)}px sans-serif`;
          ctx.fillStyle = '#64748b';
          ctx.fillText('Complete', centerX, centerY + 20);
          ctx.restore();
        }
      }
    ];
  }

  async dataInitialization(): Promise<boolean> {
    let result = false;
    const appNo = sessionStorage.getItem('APP_NO') || '';
    
    if (appNo !== '') {
      await firstValueFrom(this.appService.registratantData(appNo))
        .then(async (data) => {
          this.regStore.setRegData(data);
          this.backendProgramme = data.data?.program;
          result = true;
        })
        .catch((err) => {
          result = false;
        });
    }

    return result;
  }

  loadPaymentStatus() {
    const pStatus = sessionStorage.getItem('PAYMENT_STATUS') || '';
    if (pStatus === 'Paid') {
      this.paymentStatus = 'Completed';
      this.paymentDate = 'Jan 20, 2025';
    }
  }

  showDialog() {
    const pStatus = sessionStorage.getItem('PAYMENT_STATUS') || '';
    if (pStatus === 'Paid') {
      this.router.navigateByUrl('/pages/admissionform');
      return;
    }
    this.visible = true;
  }

  dismissGuideline() {
    if (!this.guidelinesAccepted) return;
    
    this.guidelineVisible = false;
    setTimeout(() => {
      this.router.navigateByUrl('/pages/payment');
    }, 200);
  }

  courseUpdated(event: string) {
    this.selectedCourse = event;
    this.dialogTitle = event;
  }

  showGuideline(event: boolean) {
    this.visible = !event;
    setTimeout(() => {
      this.guidelineVisible = event;
    }, 500);
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}