import { Injectable, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InactivityService implements OnDestroy {
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly activity$ = merge(
    fromEvent(window, 'mousemove'),
    fromEvent(window, 'keydown'),
    fromEvent(window, 'touchstart')
  );

  private timer: any;

  constructor() {
    this.reset();
    this.activity$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => this.reset());
  }

  private reset(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.logout(), 10 * 60 * 1000); // 10 min
  }

  private logout(): void {
    // optional: clear tokens, notify server, etc.
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.destroy$.next();
    this.destroy$.complete();
  }
}