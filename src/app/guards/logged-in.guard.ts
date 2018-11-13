import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private router: Router, private _userService: UserService) {}

  canActivate() {
	  if(this._userService.isLoggedIn()) {
		  return true;
    } else {
	    this.router.navigate(['/']);
	    return false;
    }
  }
}
