import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DesignerService {
    preset = signal({ primitive: null, semantic: null });

    acTokens = signal([]);

    setPreset(preset: { primitive: null; semantic: null; }) {
        this.preset.set(preset);
    }

    setAcTokens(token: never[]) {
        this.acTokens.set(token);
    }
}