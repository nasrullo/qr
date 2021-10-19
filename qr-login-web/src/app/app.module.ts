import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {QrPageComponent} from './pages/qr-page/qr-page.component';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {AuthGuard} from "./services/auth-guard.service";
import {AuthService} from "./services/auth.service";
import {TokenService} from "./services/token.service";
import {InterceptorService} from "./services/interceptor.service";
import {IndicatorService} from "./services/indicator.service";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {API_BASE_URL, getBaseApiUrl, getBaseWsUrl, WS_BASE_URL} from "./services/api-base-url.injection";
import {UserService} from "./services/user.service";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent,
    QrPageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatListModule,
    MatSnackBarModule
  ],
  providers: [AuthGuard, AuthService, TokenService, IndicatorService, UserService, {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  }, {provide: API_BASE_URL, useFactory: getBaseApiUrl}, {provide: WS_BASE_URL, useFactory: getBaseWsUrl},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
