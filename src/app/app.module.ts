import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Services
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { LoginPageComponent } from './login-page/login-page.component';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [
    ApiService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
