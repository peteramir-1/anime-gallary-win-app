import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { option } from '../checkbox-input.interface';

@Injectable()
export class OptionsStoreService {
  loading = true;
  readonly options = new BehaviorSubject<option[]>([]);

  add(option: option): void {
    this.options.next([...this.options.getValue(), option]);
  }

  select(value: string): void {
    const prev = this.options.getValue();
    this.options.next(
      prev.map(option => {
        if (option.value === value) {
          return { ...option, isSelected: true };
        } else {
          return { ...option, isSelected: false };
        }
      })
    );
  }

  hide(value: string): void {
    const prev = this.options.getValue();
    this.options.next(
      prev.map(option => {
        if (option.value === value) {
          return { ...option, hidden: true };
        } else {
          return option
        }
      })
    );
  }

  reset(): void {
    this.loading = false;
  }

  loaded(): void {
    this.loading = false;
  }
}
