import {
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  Component,
} from '@angular/core';
import { sidenav } from './models/sidenav';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  sidenav = sidenav;
  darkMode = this.darkModeService.darkMode;
  @ViewChild('lightModeBtn') lightModeBtn: ElementRef;
  @ViewChild('darkModeBtn') darkModeBtn: ElementRef;
  constructor(
    public darkModeService: DarkModeService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.setTheme();
    });
  }

  setTheme() {
    this.darkMode.subscribe(darkMode => {
      if (darkMode) {
        this.renderer.removeClass(this.darkModeBtn.nativeElement, 'hidden');
        this.renderer.addClass(this.lightModeBtn.nativeElement, 'hidden');
      } else {
        this.renderer.addClass(this.darkModeBtn.nativeElement, 'hidden');
        this.renderer.removeClass(this.lightModeBtn.nativeElement, 'hidden');
      }
    });
  }
}
