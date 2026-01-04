import { APP_INITIALIZER } from '@angular/core';
import { InactivityService } from './inactivity.service';

export const INACTIVITY_PROVIDERS = [
  {
    provide: APP_INITIALIZER,
    useFactory: (svc: InactivityService) => () => svc,
    deps: [InactivityService],
    multi: true
  }
];