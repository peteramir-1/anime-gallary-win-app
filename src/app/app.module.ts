import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SafeHtmlPipe } from './common/pipes/safe-html.pipe';
import { GraphQLModule } from './graphql.module';
import { NgIconsModule } from '@ng-icons/core';
import { heroHome, heroSun, heroMoon } from '@ng-icons/heroicons/outline';
import { lucideLibrary, lucideSettings } from '@ng-icons/lucide';

@NgModule({
  declarations: [AppComponent, SidenavComponent, SafeHtmlPipe, LayoutComponent],
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
