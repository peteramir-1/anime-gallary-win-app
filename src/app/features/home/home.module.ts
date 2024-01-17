import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgStringPipesModule } from 'ngx-pipes';

import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    NgStringPipesModule,

    RouterModule.forChild([{ path: '', component: HomeComponent }]),

    SharedModule,
  ],
})
export class HomeModule {}
