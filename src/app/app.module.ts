import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { DxLoadPanelModule } from 'devextreme-angular'
import { NgxSmartModalModule } from 'ngx-smart-modal';

import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService, DbService } from './shared/services';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './components/home/home.component';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';

const config: SocketIoConfig = { url: 'https://db10.bokad.se:443', options: { rejectUnauthorized: false, origins: "*" } };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SanitizeHtmlPipe
  ],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    LoginFormModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    FontAwesomeModule,
    DxLoadPanelModule,
    NgxSmartModalModule.forRoot()
  ],
  providers: [AuthService, ScreenService, AppInfoService, DbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
