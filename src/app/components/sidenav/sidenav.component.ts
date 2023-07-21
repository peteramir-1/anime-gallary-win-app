import {
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  Component,
} from '@angular/core';
import { sidenav } from './models/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  sidenav = sidenav;
  darkMode = false;
  @ViewChild('lightModeBtn') lightModeBtn: ElementRef;
  @ViewChild('darkModeBtn') darkModeBtn: ElementRef;
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.setTheme();
    });
  }

  private setTheme() {
    if (localStorage.getItem('theme') === 'light') {
      this.applyLightModeClasses();
      this.darkMode = false;
      return;
    }
    if (localStorage.getItem('theme') === 'dark') {
      this.applyDarkModeClasses();
      this.darkMode = true;
      return;
    }
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.applyLightModeClasses();
      this.darkMode = false;
    } else {
      this.applyDarkModeClasses();
      this.darkMode = true;
    }
  }

  private applyDarkModeClasses() {
    this.renderer.addClass(document.querySelector('html'), 'dark');
    this.renderer.removeClass(this.darkModeBtn.nativeElement, 'hidden');
    this.renderer.addClass(this.lightModeBtn.nativeElement, 'hidden');
  }

  private applyLightModeClasses() {
    this.renderer.removeClass(document.querySelector('html'), 'dark');
    this.renderer.addClass(this.darkModeBtn.nativeElement, 'hidden');
    this.renderer.removeClass(this.lightModeBtn.nativeElement, 'hidden');
  }

  async switchToLightTheme() {
    await localStorage.setItem('theme', 'light');
    this.setTheme();
  }

  async switchToDarkTheme() {
    await localStorage.setItem('theme', 'dark');
    this.setTheme();
  }

  toggleTheme() {
    if (this.darkMode) {
      this.switchToLightTheme();
    } else {
      this.switchToDarkTheme();
    }
  }
}
