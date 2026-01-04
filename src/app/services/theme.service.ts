import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { LayoutService } from '../layout/service/layout.service';


@Injectable({ providedIn: 'root' })
export class ThemeService {
  /* ---------- state ---------- */
  private readonly STORAGE_KEY = 'darkTheme';
  private _dark = signal<boolean>(this.initialValue());

  /* ---------- public API ---------- */
  readonly darkMode$ = toObservable(this._dark);

  constructor(private layoutService: LayoutService) {
    /* keep LayoutService in sync */
    this.darkMode$.subscribe((isDark) =>
      this.layoutService.layoutConfig.update((s) => ({ ...s, darkTheme: isDark }))
    );
  }

  /* manual toggle (called by header button) */
  toggle(): void {
    const newValue = !this._dark();
    this._dark.set(newValue);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newValue));
  }

  /* ---------- helpers ---------- */
  private initialValue(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored !== null) {
      return JSON.parse(stored);          // user had chosen explicitly
    }
    // no stored choice → honour OS / browser
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}