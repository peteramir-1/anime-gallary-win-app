import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable } from 'rxjs';
export class DialogRef {
  private afterClosedSubject = new Subject<any>();
  constructor(private overlayRef: OverlayRef) {}

  public close(result?: any) {
    this.overlayRef.dispose();
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
  }

  public afterClosed(): Observable<any> {
    return this.afterClosedSubject.asObservable();
  }
}
