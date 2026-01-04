import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalLoadingComponent } from './app/global-loader/global-loader.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule,GlobalLoadingComponent],
    template: `
    <router-outlet></router-outlet>
     <app-global-loading></app-global-loading>
    `
})
export class AppComponent {}
