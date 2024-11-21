import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NavigationEnd, Router } from '@angular/router';

import { RouterHistoryService } from './router-history.service';

import { Subject } from 'rxjs';

describe('RouterHistoryService', () => {
  let service: RouterHistoryService;
  let router: Router;
  let routerEvents$: Subject<any>;

  beforeEach(() => {
    routerEvents$ = new Subject<any>();

    const mockRouter = {
      navigateByUrl: jasmine
        .createSpy('navigateByUrl')
        .and.returnValue(Promise.resolve(true)),
      events: routerEvents$.asObservable(),
    };

    TestBed.configureTestingModule({
      providers: [
        RouterHistoryService,
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(RouterHistoryService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    routerEvents$.complete();
  });

  it('should add URLs to _history on navigation', () => {
    routerEvents$.next(new NavigationEnd(1, '/first-page', '/first-page'));
    routerEvents$.next(new NavigationEnd(2, '/second-page', '/second-page'));

    expect(service.history).toEqual(['/first-page', '/second-page']);
  });

  it('should navigate to the previous URL on go Back', fakeAsync(() => {
    routerEvents$.next(new NavigationEnd(1, '/first-page', '/first-page'));
    routerEvents$.next(new NavigationEnd(2, '/second-page', '/second-page'));

    service.goBack();
    tick();

    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/first-page');
  }));

  it('should block repeated goBack calls during ongoing navigation', fakeAsync(() => {
    routerEvents$.next(new NavigationEnd(1, '/first-page', '/first-page'));
    routerEvents$.next(new NavigationEnd(2, '/second-page', '/second-page'));

    service.goBack();
    service.goBack();
    tick();

    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/first-page');
  }));

  it('should reset isNavigation after navigation completion', fakeAsync(() => {
    routerEvents$.next(new NavigationEnd(1, '/first-page', '/first-page'));
    routerEvents$.next(new NavigationEnd(2, '/second-page', '/second-page'));

    service.goBack();
    tick();

    routerEvents$.next(new NavigationEnd(3, 'first-page', 'first-page'));

    service.goBack();
    tick();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/first-page');

    expect(router.navigateByUrl).toHaveBeenCalledTimes(2);
  }));

  it('should clear _history and _forwardHistory on reset', fakeAsync(() => {
    routerEvents$.next(new NavigationEnd(1, '/first-page', '/first-page'));
    routerEvents$.next(new NavigationEnd(2, '/second-page', '/second-page'));

    service.goBack();
    tick();

    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/first-page');

    service.reset();

    expect(service.forwardHistory).toEqual([]);
    expect(service.history).toEqual([]);
  }))
});
