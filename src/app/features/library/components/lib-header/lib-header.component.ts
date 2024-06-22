import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-lib-header',
  templateUrl: './lib-header.component.html',
  styleUrl: './lib-header.component.scss',
})
export class LibHeaderComponent implements OnInit {
  @Input({required: true}) readonly animes = [];
  @Output() onFiltering = new EventEmitter<any[]>();
  @Output() onSearchByName = new EventEmitter<string>();

  searchResult = '';

  readonly likedFilter = new BehaviorSubject<boolean>(false);
  readonly statusFilter = new BehaviorSubject<'complete' | 'incomplete' | undefined>(
    undefined
  );
  readonly seasonFilter = new BehaviorSubject<
    'summer' | 'autumn' | 'winter' | 'spring' | undefined
  >(undefined);
  readonly releaseDateFilter = new BehaviorSubject<string | undefined>(undefined);
  readonly years = Array.from(
    { length: new Date().getFullYear() - 1917 },
    (_, index) => new Date().getFullYear() - (index + 1)
  ).map(val => val.toString());

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    combineLatest([
      this.statusFilter,
      this.likedFilter,
      this.seasonFilter,
      this.releaseDateFilter,
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(
          (previous, current) =>
            JSON.stringify(previous) === JSON.stringify(current)
        ),
        tap(([statusFilter, likedFilter, seasonFilter, releaseDateFilter]) => {
          if (this.animes.length === 0) {
            this.onFiltering.emit([]);
            return;
          }
          this.onFiltering.emit(
            this.animes
              .filter(anime => {
                if (!likedFilter) return true;
                else return anime.liked === true;
              })
              .filter(anime => {
                if (statusFilter === undefined) return true;
                else return anime.status === statusFilter;
              })
              .filter(anime => {
                if (seasonFilter === undefined) return true;
                else return anime.season === seasonFilter;
              })
              .filter(anime => {
                if (releaseDateFilter === undefined) return true;
                else return anime.released === releaseDateFilter;
              })
          );
        })
      )
      .subscribe();
  }

  /**
   * clears anime status filter
   */
  clearStatusFilter(): void {
    this.statusFilter.next(undefined);
  }

  /**
   * sets anime status filter
   * @param status anime status
   */
  setStatusFilter(status: 'complete' | 'incomplete'): void {
    this.statusFilter.next(status);
  }

  /**
   * clear anime season Filter
   */
  clearSeasonFilter(): void {
    this.seasonFilter.next(undefined);
  }

  /**
   * sets anime season filter 
   * @param season anime season
   */
  setSeasonFilter(season: 'autumn' | 'summer' | 'winter' | 'spring'): void {
    this.seasonFilter.next(season);
  }

  /**
   * clears anime release date filter
   */
  clearReleaseDateFilter(): void {
    this.releaseDateFilter.next(undefined);
  }

  /**
   * sets anime release date filter
   * @param releaseDate anime release date 
   */
  setReleaseDateFilter(releaseDate: string): void {
    this.releaseDateFilter.next(releaseDate);
  }

  /**
   * emits the new value of anime search by name form control to parent component
   * @param name name of the anime
   */
  searchByName(name: string) {
    this.onSearchByName.emit(name);
  }
}
