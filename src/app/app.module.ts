import { NgModule } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './core/routes/app.routing';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';
import { LayoutComponent } from './core/components/layout/layout.component';
import { GraphQLModule } from './core/modules/graphql.module';
import { NgIconsModule } from '@ng-icons/core';
import { heroHome, heroSun, heroMoon } from '@ng-icons/heroicons/outline';
import { lucideLibrary, lucideSettings, lucideEye } from '@ng-icons/lucide';
import { WidgetContainerModule } from './shared/directives/widget-container/widget-container.module';
import { ScrollableModule } from './shared/directives/scrollable/scrollable.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ButtonModule } from './shared/directives/button/button.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  declarations: [AppComponent, SidenavComponent, LayoutComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgIconsModule.withIcons({
      heroHome,
      lucideLibrary,
      lucideSettings,
      lucideEye,
      heroSun,
      heroMoon,
    }),
    AppRoutingModule,
    GraphQLModule,
    ScrollableModule,
    WidgetContainerModule,
    ButtonModule,
    NgxUiLoaderModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
