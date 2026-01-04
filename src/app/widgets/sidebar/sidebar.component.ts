import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WidgetsService } from '../services/widgets.service';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';
import { TraceabilityModule } from '../../shared/traceability.module';


@Component({
  selector: 'app-sidebar',
  imports: [TraceabilityModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  sidebarVisible = false;
  
  _widgetService = inject(WidgetsService);
  router = inject(Router);

  constructor() {
    this._widgetService.sidebarState$.subscribe((state: sidebarStateDTO) => {
      this.sidebarVisible = state.isvisible;
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onSidebarHide() {
    this._widgetService.setSidebarState({ isvisible: false });
  }

  close() {
    this._widgetService.setSidebarState({ isvisible: false });
  }

  logOut() {
    sessionStorage.clear();
    localStorage.removeItem('theme');
    setTimeout(() => {
      this.router.navigateByUrl('/auth/login');
    }, 300);
  }
}