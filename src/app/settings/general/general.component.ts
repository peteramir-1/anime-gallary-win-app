import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  darkMode = this.darkModeService.darkMode;
  constructor(public darkModeService: DarkModeService) { }

  ngOnInit(): void {
  }

}
