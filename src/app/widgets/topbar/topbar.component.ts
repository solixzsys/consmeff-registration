import { Component, inject } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { WidgetsService } from '../services/widgets.service';
import { TraceabilityModule } from '../../shared/traceability.module';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  imports: [TraceabilityModule],
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  _widgetService = inject(WidgetsService);
  
  isDarkMode = false;
  username = '';
  userInitials = '';
  notificationCount = 3;
  messageCount = 2;

  notifications: MenuItem[] = [
    {
      label: 'Application Deadline Extended',
      icon: 'pi pi-info-circle',
      command: () => this.handleNotification(1)
    },
    {
      label: 'Payment Confirmation Received',
      icon: 'pi pi-check-circle',
      command: () => this.handleNotification(2)
    },
    {
      label: 'Document Verification Complete',
      icon: 'pi pi-file',
      command: () => this.handleNotification(3)
    }
  ];

  messages: MenuItem[] = [
    {
      label: 'Welcome to the portal',
      icon: 'pi pi-envelope',
      command: () => this.handleMessage(1)
    },
    {
      label: 'Update your profile',
      icon: 'pi pi-user-edit',
      command: () => this.handleMessage(2)
    }
  ];

  profileMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.navigateTo('/pages/profile')
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.navigateTo('/pages/settings')
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  constructor() {
    this.username = sessionStorage.getItem('user_name') || 'User';
    this.userInitials = this.getInitials(this.username);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark');
    }
  }

  toggleSidebar() {
    this._widgetService.setSidebarState({ isvisible: true });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  handleNotification(id: number) {
    console.log('Notification clicked:', id);
  }

  handleMessage(id: number) {
    console.log('Message clicked:', id);
  }

  navigateTo(route: string) {
    // Handle navigation
    console.log('Navigate to:', route);
  }

  logout() {
    sessionStorage.clear();
    localStorage.removeItem('theme');
    window.location.href = '/auth/login';
  }
}