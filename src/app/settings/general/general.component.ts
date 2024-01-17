import { Component } from '@angular/core';
import { DarkModeService } from 'src/app/core/services/dark-mode.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent {
  darkMode = this.darkModeService.darkMode.value;

  constructor(private darkModeService: DarkModeService) {}

  toggleTheme(): void {
    this.darkModeService.toggleTheme()
  }
}
