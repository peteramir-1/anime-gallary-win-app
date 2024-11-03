import { NgModule } from '@angular/core';

import { AddAnimeComponent } from './add-anime.component';
import { NgIconsModule } from '@ng-icons/core';
import { heroBackspaceSolid } from '@ng-icons/heroicons/solid';
import { matFolder } from '@ng-icons/material-icons/baseline';
import { InputModule } from 'src/app/shared/directives/input/inputs.module';
import { FilepathInputModule } from 'src/app/shared/modules/inputs/filepath-input/filepath-input.module';
import { SelectModule } from 'src/app/shared/modules/inputs/select/select.module';
import { ImageInputModule } from '../image-input/image-input.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddAnimeService } from './services/add-anime.service';
import { AddAnimeRoutingModule } from './routes/add-anime.routes';

@NgModule({
  declarations: [AddAnimeComponent],
  imports: [
    NgIconsModule.withIcons({
      matFolder,
      heroBackspaceSolid,
    }),

    AddAnimeRoutingModule,

    // Library Features
    ImageInputModule,

    // Input Modules
    InputModule,
    SelectModule,
    FilepathInputModule,

    // MatMenuModule,

    SharedModule,
  ],
  providers: [AddAnimeService],
})
export class AddAnimeModule {}
