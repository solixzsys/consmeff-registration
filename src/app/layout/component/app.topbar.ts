import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { TooltipModule } from 'primeng/tooltip';
import { jwtDecode } from 'jwt-decode';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, TooltipModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="https://www.afri-health.com/wp-content/uploads/2023/05/Favicon-1.png" style="height: 25px;" alt="" srcset="">
                <span style="font-family: monospace;font-weight:900">consmmefs</span>
            </a>
        </div>
     

        <div class="layout-topbar-actions">
      
            <div class="layout-config-menu">
            <div style="display: flex;align-items: center;margin-right: 1rem;">
     <span style="font-family: monospace;font-weight:600">{{companyName}}</span>
</div>
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative"  style="display: none;">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <!-- <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button> -->
                    <button type="button" class="layout-topbar-action" pTooltip="{{email}}" tooltipPosition="left">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];
    email = "";
    companyName = "";
    private theme = inject(ThemeService);

    constructor(public layoutService: LayoutService) {
        const raw = sessionStorage.getItem('key');
        if (!raw) return;

        try {
            const { email } = jwtDecode<{ email?: string }>(raw);
            this.email = email ?? '—';
            const { orgname } = jwtDecode<{ orgname?: string }>(raw);
            this.companyName = orgname ?? '';
        } catch {
            this.email = '—';
        }
    }

    toggleDarkMode() {
        // this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
        this.theme.toggle();
    }
}
