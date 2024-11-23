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

  /**
   * Toggles the application's theme between dark and light modes
   * using the DarkModeService.
   */
  toggleTheme(): void {
    this.darkModeService.toggleTheme()
  }
}
