import { DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { RouterHistoryService } from './core/services/router-history.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { RIGHT_ARROW, LEFT_ARROW, ESCAPE } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  private readonly destroyed = inject(DestroyRef);
  private readonly routerHistoryService = inject(RouterHistoryService);

  ngOnInit(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntilDestroyed(this.destroyed),
        filter(
          event =>
            (event.altKey && event.keyCode === LEFT_ARROW) ||
            event.keyCode === ESCAPE
        )
      )
      .subscribe(() => {
        this.routerHistoryService.goBack();
      });

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntilDestroyed(this.destroyed),
        filter(event => event.altKey && event.keyCode === RIGHT_ARROW)
      )
      .subscribe(() => {
        this.routerHistoryService.goForward();
      });
  }
}
