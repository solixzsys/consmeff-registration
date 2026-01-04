// core/permission.service.ts
import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';          // npm i jwt-decode

export type RoleId =
  | 'can_generate_sgtin'
  | 'can_generate_sscc'
  | 'can_upload_event_file'
  | 'can_integrate_with_api'
  | 'can_generate_barcode'
  | 'can_download_barcode_label'
  | 'can_commission_with_form'
  | 'can_commission_in_batches'
  | 'can_pack_with_form'
  | 'can_pack_in_batches'
  | 'can_unpack_partially'
  | 'can_unpack_in_full'
  | 'can_transfer'
  | 'can_transfer_in_batches'
  | 'can_receive'
  | 'can_receive_in_batches'
  | 'can_view_eventlog'
  | 'can_view_productinformation'
  | 'can_view_locationinformation'
  | 'can_view_settings';

interface UserToken {
    roles?: RoleId[];
    email: string;
    sub: string;
    iat: number;
    exp: number;
    alias?: string;
}

@Injectable({ providedIn: 'root' })
export class PermissionService {

    private _roles = signal<RoleId[]>(this.readRolesFromJWT());


    readonly roles = this._roles.asReadonly();


    private _isAdmin = signal(this.readRolesFromJWT().length === ALL_ROLES.length);
    readonly isAdmin = this._isAdmin.asReadonly();

    hasRole(role: RoleId | RoleId[]): boolean {
        const required = Array.isArray(role) ? role : [role];
        const userRoles = this._roles();
        return required.some(r => userRoles.includes(r));
    }

    loadRoles(): void {
        this._roles.set(this.readRolesFromJWT());
    }


    private readRolesFromJWT(): RoleId[] {
        console.log('Reading roles from JWT...');
        const raw = sessionStorage.getItem('key');
        if (!raw) return [];

        try {
            const payload = jwtDecode<UserToken>(raw);

            if (!payload.roles || !Array.isArray(payload.roles)) {
                return ALL_ROLES;
            }
            return payload.roles;
        } catch {
            return [];
        }
    }


    hasEveryRole(roles: RoleId[]): boolean {
        const userRoles = this._roles();
        return roles.some(r => userRoles.includes(r));
    }


}


export const ALL_ROLES: RoleId[] = [
    'can_generate_sgtin',
    'can_generate_sscc',
    'can_upload_event_file',
    'can_integrate_with_api',
    'can_generate_barcode',
    'can_download_barcode_label',
    'can_commission_with_form',
    'can_commission_in_batches',
    'can_pack_with_form',
    'can_pack_in_batches',
    'can_unpack_partially',
    'can_unpack_in_full',
    'can_transfer',
    'can_transfer_in_batches',
    'can_receive',
    'can_receive_in_batches',
    'can_view_eventlog',
    'can_view_productinformation',
    'can_view_locationinformation',
    'can_view_settings'
  ];