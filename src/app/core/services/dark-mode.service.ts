import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  public darkMode = new BehaviorSubject<boolean>((() => {
    if (localStorage.getItem('theme') === 'light') {
      document.querySelector('html').classList.remove('dark');
      return false;
    } else {
      document.querySelector('html').classList.add('dark');
      return true
    }
  })());
  constructor() {}
  
  async switchToLightTheme() {
    await localStorage.setItem('theme', 'light');
    document.querySelector('html').classList.remove('dark');
    this.darkMode.next(false);
  }  
  
  async switchToDarkTheme() {
    await localStorage.setItem('theme', 'dark');
    document.querySelector('html').classList.add('dark');
    this.darkMode.next(true);
  }

  public toggleTheme() {
    if (this.darkMode.getValue()) {
      this.switchToLightTheme();
    } else {
      this.switchToDarkTheme();
    }
  }
}
