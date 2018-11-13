import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { LoggedInGuard } from './guards/logged-in.guard';

// Components
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';

const appRoutes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'home', component: HomePageComponent, canActivate: [LoggedInGuard] }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
