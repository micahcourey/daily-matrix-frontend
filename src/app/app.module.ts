import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

// Services
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

// Guards
import { LoggedInGuard } from './guards/logged-in.guard';

const routes: Routes = [ ];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    routing,
    RouterModule.forRoot(routes),
  ],
  providers: [
    ApiService,
    UserService,
    LoggedInGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
