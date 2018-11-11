import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  apiLoginError;
  loggingIn: boolean;
  loginError: string;
  loggedIn: boolean;
  user: any;

  constructor(private _userService: UserService) { 
    this.loggingIn = false;
    this.loginError = "";
    this.loggedIn = false;
		this.loginForm = new FormGroup({    
			email: new FormControl('', [ Validators.required, Validators.email ]),
			password: new FormControl('', [ ]),
    })
    if (this._userService.getLoginStatusChangeSub) {
      this.loggedIn = true;
    }
  }

  ngOnInit() {
  }

  doLogin(){
		// Performing validation upon submit as a workaround for browser autofill w/ disabled button issue 
		if (!this.loginForm.valid) {
			this.apiLoginError = {email: ['Your email or password is not valid']};
			return;
    }
    console.log(this.loginForm.value)
		this.loggingIn = true;
		if (this.apiLoginError) {
			this.apiLoginError = {};
		}
 		this._userService.login(this.loginForm.value).then((res:any) => {
      this.loginError = "";
      this.loggedIn = true;
      this.user = res;
      // this.loginRedirect();
      console.log(res)
			
 		}, (errors:any)=>{
			if(errors.expired){
				// this.router.navigate(['/expired', {'company_id': errors.company_id}]);
			}else{
				// this.onError.emit();
				this.loggingIn = false;
				this.apiLoginError = errors;
			}
	  });
	}

}
