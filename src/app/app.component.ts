import { Component, OnChanges } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnChanges {
  loggedIn: boolean;

  constructor(private _userService: UserService, private router: Router) {
    this.loggedIn = false
  }

  ngOnChanges() {
    if (this._userService.isLoggedIn()) {
      this.loggedIn = true;
    }
  }

  logout() {
    this._userService.logout();
    this.loggedIn = false;
    this.router.navigate(['/'])
  }

}
