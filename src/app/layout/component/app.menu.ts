import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ALL_ROLES, PermissionService } from '../../services/permission.service';
import { RegStoreService } from '../../services/regstore.service';
import { RegistrantDataDTO } from '../../data/application/registrantdatadto';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];


    constructor(private permission: PermissionService, private regstore: RegStoreService,) { }

    ngOnInit() {
        const fullTree: MenuItem[] = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/pages/dashboard'] }]
            },

            {
                label: 'Application',
                icon: '',
                items: [
                    {
                        label: 'Registration',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'New Registration',
                                icon: 'pi pi-fw pi-sign-out',
                                routerLink: ['/pages/admissionform']
                            },
                            {
                                label: 'Registration Summary',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['/pages/summarypage']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Access',
                icon: '',
                items: [
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'LoginOut',
                                icon: 'pi pi-fw pi-sign-out',
                                routerLink: ['/auth/logout']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Setting',
                icon: '',
                items: [

                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                        routerLink: ['/setting/settings']
                    }
                ],
                data: { roles: ['can_view_settings'] }


            },
        ];

        this.model = this.filterMenu(fullTree);
        this.regstore.regData$.subscribe((data) => {
            this.setRegistrationStage(data);
        });

    }

    setRegistrationStage(data: RegistrantDataDTO|null) {
        let _data = data?.data;
        if (_data != undefined && _data != null) {
            if (
                _data.residential_address != null &&
                _data.primary_parent_or_guardian != null &&
                _data.academic_history != null &&
                _data.o_level_result != null &&
                _data.utme_result != null &&
                _data.certificate_of_birth != null &&
                _data.passport_photo != null
            ) {
                this.model[1]?.items?.[0]?.items?.[0] && (this.model[1].items[0].items[0].visible = false);
            } else {
                this.model[1]?.items?.[0]?.items?.[1] && (this.model[1].items[0].items[1].visible = false);
            }


        }
    }

    private filterMenu(items: MenuItem[]): MenuItem[] {
        return items
            .map(n => ({ ...n }))
            .filter(n => {
                const needed = n['data']?.roles;
                if (!needed || needed.length === 0) return true;          // public item
                return this.permission.hasEveryRole(needed);              // <-- new helper
            })
            .map(n => {
                if (n.items?.length) n.items = this.filterMenu(n.items);
                return n;
            })
            .filter(n => (n.items?.length || n.routerLink));           // prune empty
    }
}
