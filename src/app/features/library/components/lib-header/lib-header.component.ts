import {
  Component,
  DestroyRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderByPipe } from 'ngx-pipes';
import { FormControl } from '@angular/forms';

type SEASONS = 'summer' | 'autumn' | 'winter' | 'spring' | null;
type STATUS = 'complete' | 'incomplete' | null;

@Component({
  selector: 'app-lib-header',
  templateUrl: './lib-header.component.html',
  styleUrl: './lib-header.component.scss',
  providers: [OrderByPipe],
  host: {
    class: 'flex flex-row flex-wrap gap-5',
  },
  standalone: false,
})
export class LibHeaderComponent implements OnInit {
  private readonly orderByPipe = inject(OrderByPipe);

  @Input({ required: true }) readonly animes = [];
  @Output() onFiltering = new EventEmitter<any[]>();
  @Output() onSearchByName = new EventEmitter<string>();

  searchResultControl = new FormControl<string>('');
  releaseDateControl: string = null;
  seasonControl: SEASONS = null;
  statusControl: STATUS = null;
  orderByControl: string = null;

  readonly likedFilter = new BehaviorSubject<boolean>(false);
  readonly statusFilter = new BehaviorSubject<STATUS>(null);
  readonly seasonFilter = new BehaviorSubject<SEASONS>(null);
  readonly releaseDateFilter = new BehaviorSubject<string | null>(null);
  readonly orderBy = new BehaviorSubject<string | null>(null);

  readonly years: string[] = Array.from(
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
      this.orderBy,
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(
          (previous, current) =>
            JSON.stringify(previous) === JSON.stringify(current)
        ),
        tap(
          ([
            statusFilter,
            likedFilter,
            seasonFilter,
            releaseDateFilter,
            orderBy,
          ]) => {
            if (this.animes.length === 0) {
              this.onFiltering.emit([]);
              return;
            }
            this.onFiltering.emit(
              this.orderByPipe.transform(
                this.animes
                  .filter(anime => {
                    if (!likedFilter) return true;
                    else return anime.liked === true;
                  })
                  .filter(anime => {
                    if (statusFilter === null) return true;
                    else return anime.status === statusFilter;
                  })
                  .filter(anime => {
                    if (seasonFilter === null) return true;
                    else return anime.season === seasonFilter;
                  })
                  .filter(anime => {
                    if (releaseDateFilter === null) return true;
                    else return anime.released === releaseDateFilter;
                  }),
                [orderBy ?? 'id', 'id']
              )
            );
          }
        )
      )
      .subscribe();

    this.searchResultControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(searchResult => this.searchByName(searchResult));
  }

  /**
   * clears anime status filter
   */
  clearStatusFilter(): void {
    this.statusFilter.next(null);
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
    this.seasonFilter.next(null);
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
    this.releaseDateFilter.next(null);
  }

  /**
   * sets anime release date filter
   * @param releaseDate anime release date
   */
  setReleaseDateFilter(releaseDate: string): void {
    this.releaseDateFilter.next(releaseDate);
  }

  /**
   * sets all animes sorting by
   * @param releaseDate anime release date
   */
  setOrderBy(orderBy: string): void {
    this.orderBy.next(orderBy);
  }

  /**
   * emits the new value of anime search by name form control to parent component
   * @param name name of the anime
   */
  searchByName(name: string) {
    this.onSearchByName.emit(name);
  }
}
