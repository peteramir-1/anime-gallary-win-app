import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './core/routes/app.routing';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';
import { LayoutComponent } from './core/components/layout/layout.component';
import { GraphQLModule } from './core/modules/graphql.module';
import { NgIconsModule } from '@ng-icons/core';
import { heroHome, heroSun, heroMoon } from '@ng-icons/heroicons/outline';
import { lucideLibrary, lucideSettings } from '@ng-icons/lucide';
import { WidgetContainerModule } from './shared/directives/widget-container/widget-container.module';
import { ScrollableModule } from './shared/directives/scrollable/scrollable.module';
import { AppOverlayContainer } from './core/services/app-overlay-container.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { APP_SNACK_BAR_DEFAULT_OPTIONS } from './shared/models/app-snackbar.model';

@NgModule({
  declarations: [AppComponent, SidenavComponent, LayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgIconsModule.withIcons({
      heroHome,
      lucideLibrary,
      lucideSettings,
      heroSun,
      heroMoon,
    }),
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule,
    ScrollableModule,
    WidgetContainerModule,
  ],
  providers: [
    {
      provide: OverlayContainer,
      useExisting: AppOverlayContainer,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: APP_SNACK_BAR_DEFAULT_OPTIONS,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
