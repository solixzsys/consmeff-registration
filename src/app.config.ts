import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';

import { LoadingInterceptor } from './app/services/loading.interceptor';
import { jwtInterceptor } from './app/services/jwt.interceptor';
import { INACTIVITY_PROVIDERS } from './app/services/inactivity-providers';
import { ThemeService } from './app/services/theme.service';


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch(),withInterceptors([LoadingInterceptor,jwtInterceptor])),     
        provideAnimationsAsync(),
        ...INACTIVITY_PROVIDERS,
        {
            provide: APP_INITIALIZER,
            useFactory: () => {
              inject(ThemeService);          // side-effect: ctor runs, theme applied
              return () => Promise.resolve(); // immediately done
            },
            multi: true,
          },
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
    ]
};
