import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ALL_ROLES, PermissionService } from '../../services/permission.service';

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


    constructor(private permission: PermissionService) { }

    ngOnInit() {
        const fullTree: MenuItem[] = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/pages/dashboard'] }]
            },

            // {
            //     label: 'Traceability',
            //     icon: 'pi pi-fw pi-briefcase',
            //     routerLink: ['/traceability'],
            //     data: { roles: ALL_ROLES.slice(0, -2) },
            //     items: [
            //         {
            //             label: 'Serialization',
            //             icon: 'pi pi-th-large',
            //             items: [
            //                 {
            //                     label: 'Encoding Intent',
            //                     icon: 'pi pi-fw pi-key',
            //                     routerLink: ['/traceability/serialization/encoding'],
            //                     data: { roles: ['can_generate_sgtin', 'can_generate_sscc', 'can_upload_event_file', 'can_integrate_with_api'] }
            //                 },
            //                 {
            //                     label: 'Barcoding',
            //                     icon: 'pi pi-fw pi-qrcode',
            //                     routerLink: ['/traceability/serialization/barcoding'],
            //                     data: { roles: ['can_generate_barcode', 'can_download_barcode_label'] }
            //                 },
            //                 {
            //                     label: 'CodingLists',
            //                     icon: 'pi pi-fw pi-list',
            //                     routerLink: ['/traceability/serialization/codinglist']
            //                 }
            //             ],
            //             data: { roles: ALL_ROLES.slice(0, 5) },
            //         },
            //         {
            //             label: 'Commission',
            //             icon: 'pi pi-microchip',
            //             items: [
            //                 {
            //                     label: 'Commission Intent',
            //                     icon: 'pi pi-fw pi-external-link',
            //                     routerLink: ['/traceability/commissioning/commissioning'],
            //                     data: {
            //                         roles: ['can_commission_with_form',
            //                             'can_commission_in_batches']
            //                     }
            //                 },
            //                 {
            //                     label: 'CommissionList',
            //                     icon: 'pi pi-list-check',
            //                     routerLink: ['/traceability/commissioning/commissionlist']
            //                 }

            //             ],
            //             data: {
            //                 roles: ['can_commission_with_form',
            //                     'can_commission_in_batches']
            //             },
            //         },
            //         {
            //             label: 'Aggregation',
            //             icon: 'pi pi-sitemap',
            //             items: [
            //                 {
            //                     label: 'Packing',
            //                     icon: 'pi pi pi-fw pi-box',
            //                     routerLink: ['/traceability/aggregation/packing'],
            //                     data: {
            //                         roles: ['can_pack_with_form',
            //                             'can_pack_in_batches']
            //                     }
            //                 },
            //                 {
            //                     label: 'UnPacking',
            //                     icon: 'pi pi-sort-alt-slash',
            //                     routerLink: ['/traceability/aggregation/unpacking'],
            //                     data: {
            //                         roles: ['can_unpack_partially',
            //                             'can_unpack_in_full']
            //                     }
            //                 }
            //             ],
            //             data: {
            //                 roles: ['can_pack_with_form',
            //                     'can_pack_in_batches',
            //                     'can_unpack_partially',
            //                     'can_unpack_in_full']
            //             },
            //         },
            //         {
            //             label: 'Transaction',
            //             icon: 'pi pi-fw pi-arrow-right-arrow-left',
            //             items: [
            //                 {
            //                     label: 'Shipping',
            //                     icon: 'pi pi-fw pi-sign-in',
            //                     routerLink: ['/traceability/transaction/shipping'],
            //                     data: {
            //                         roles: ['can_transfer',
            //                             'can_transfer_in_batches']
            //                     }
            //                 },
            //                 {
            //                     label: 'Receiving',
            //                     icon: 'pi pi-fw pi-truck',
            //                     routerLink: ['/traceability/transaction/receiving'],
            //                     data: {
            //                         roles: ['can_receive',
            //                             'can_receive_in_batches',]
            //                     }
            //                 },
            //                 {
            //                     label: 'TransferList',
            //                     icon: 'pi pi-angle-double-down',
            //                     routerLink: ['/traceability/transaction/transferlist']
            //                 }
            //             ],
            //             data: {
            //                 roles: [
            //                     'can_receive',
            //                     'can_transfer',
            //                     'can_transfer_in_batches',
            //                     'can_receive_in_batches']
            //             },
            //         },
            //         {
            //             label: 'Events Information',
            //             icon: 'pi pi-history',
            //             items: [

            //                 {
            //                     label: 'EventsLog',
            //                     icon: 'pi pi-fw pi-calendar',
            //                     routerLink: ['/traceability/eventinformation/eventslog']
            //                 }
            //             ],
            //             data: { roles: ['can_view_eventlog'] }
            //         },
            //     ]
            // },
            // {
            //     label: 'Master Data Information',
            //     icon: '',
            //     items: [
            //         {
            //             label: 'Products Information',
            //             icon: 'pi pi-fw pi-box',
            //             routerLink: ['/masterdata/products'],
            //             data: { roles: ['can_view_productinformation'] }
            //         },
            //         {
            //             label: 'Locations Information',
            //             icon: 'pi pi-fw pi-map-marker',
            //             routerLink: ['/masterdata/locations'],
            //             data: { roles: ['can_view_locationinformation'] }
            //         }
            //     ],
            //     data: {
            //         roles: [
            //             'can_view_productinformation',
            //             'can_view_locationinformation'
            //         ]
            //     }
            // },
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
