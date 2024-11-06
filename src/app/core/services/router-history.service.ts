import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouterHistoryService {
  private readonly router = inject(Router);
  private readonly destroyed = inject(DestroyRef);

  /**
   * Stores URLs as the user navigates
   *
   * @private
   * @type {string[]}
   */
  private _history: string[] = [];

  /**
   * Stores URLs for forward navigation
   *
   * @private
   * @type {string[]}
   */
  private _forwardHistory: string[] = [];

  /**
   * Prevents repeated actions while navigation is in progress
   *
   * @private
   * @type {boolean}
   */
  private isNavigating = false;

  get history() {
    return this._history;
  }

  get forwardHistory() {
    return this._forwardHistory;
  }

  constructor() {
    this.startTracking();
  }

  /**
   * Tracks navigation and saves records of the urls to history property
   *
   * @private
   * @returns {void}
   */
  private startTracking(): void {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyed),
        filter(event => event instanceof NavigationEnd && !this.isNavigating)
      )
      .subscribe((event: NavigationEnd) => {
        // Stop navigation flag on navigation Completion
        this.isNavigating = false;

        // Add new route to history if it's not part of back/forward navigation
        if (!this.isNavigating) {
          // Clear forward navigation on a new navigation
          this._forwardHistory = [];

          this._history.push(event.urlAfterRedirects);
        }
      });
  }

  /**
   * Moves the last item from _history to _forwardHistory and
   * navigates to the previous page
   *
   * @public
   * @returns {void}
   */
  goBack(): void {
    if (this._history.length > 1 && !this.isNavigating) {
      // Mark as navigating to prevent repeated back actions
      this.isNavigating = true;

      // Move current URL to forward history
      this._forwardHistory.push(this._history.pop()!);

      // Navigate to the previous URL
      const previousUrl = this._history[this._history.length - 1];
      this.router.navigateByUrl(previousUrl).then(() => {
        this.isNavigating = false; // Reset after navigation completes
      });
    }
  }

  /**
   * Moves the last item from _forwardHistory to _history and navigates forward
   *
   * @public
   * @returns {void}
   */
  goForward(): void {
    if (this._forwardHistory.length > 0 && !this.isNavigating) {
      // Mark as navigating to prevent repeated forward actions
      this.isNavigating = true;

      // Move the next url to history and removes it from forward history
      const nextUrl = this._forwardHistory.pop()!;
      this._history.push(nextUrl);

      // Navigate to the next URL
      this.router.navigateByUrl(nextUrl).then(() => {
        this.isNavigating = false;
      });
    }
  }

  /**
   * Resets all major properties of the service
   *
   * @public
   * @returns {void}
   */
  reset(): void {
    this._history = [];
    this._forwardHistory = [];
  }
}
