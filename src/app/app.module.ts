import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { routing } from './app.routing';

// Services
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

// Guards
import { LoggedInGuard } from './guards/logged-in.guard';

// Material Components
import {
  MatButtonModule, 
  MatFormFieldModule, 
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule,
  MatCardModule,
  MatDividerModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatIconModule,
  MatToolbarModule,
  MatListModule,
  MatExpansionModule
} from '@angular/material';

// App Components
import { AppComponent } from './app.component';

import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ActivityEditorComponent } from './home-page/activity-editor/activity-editor.component';
import { GoalTrackerComponent } from './home-page/goal-tracker/goal-tracker.component';

const routes: Routes = [ ];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    ActivityEditorComponent,
    GoalTrackerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    routing,
    RouterModule.forRoot(routes),
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule
  ],
  providers: [
    ApiService,
    UserService,
    LoggedInGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
