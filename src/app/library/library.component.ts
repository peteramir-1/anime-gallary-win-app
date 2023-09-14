import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnDestroy {
  searchResult = '';
  likedFilter = new BehaviorSubject<boolean>(false);
  statusFilter = new BehaviorSubject<'complete' | 'incomplete' | undefined>(
    undefined
  );
  seasonFilter = new BehaviorSubject<
    'summer' | 'autumn' | 'winter' | 'spring' | undefined
  >(undefined);
  releaseDateFilter = new BehaviorSubject<string | undefined>(undefined);
  animes = this.activeRoute.data.pipe(map(data => data.animes));
  readonly years = Array.from(
    { length: new Date().getFullYear() - 1917 },
    (_, index) => new Date().getFullYear() - (index + 1)
  ).map(val => val.toString());
  private readonly destroy$ = new Subject<void>();

  constructor(private activeRoute: ActivatedRoute) {
    combineLatest([
      this.statusFilter,
      this.likedFilter,
      this.seasonFilter,
      this.releaseDateFilter,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([statusFilter, likedFilter, seasonFilter, releaseDateFilter]) => {
          this.animes = this.activeRoute.data.pipe(
            map(data => data.animes),
            map(animes =>
              animes
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
            )
          );
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearStatusFilter(): void {
    this.statusFilter.next(undefined);
  }

  setStatusFilter(status: 'complete' | 'incomplete'): void {
    this.statusFilter.next(status);
  }

  clearSeasonFilter(): void {
    this.seasonFilter.next(undefined);
  }

  setSeasonFilter(season: 'autumn' | 'summer' | 'winter' | 'spring'): void {
    this.seasonFilter.next(season);
  }

  clearReleaseDateFilter(): void {
    this.releaseDateFilter.next(undefined);
  }

  setReleaseDateFilter(releaseDate: string): void {
    this.releaseDateFilter.next(releaseDate);
  }
}
