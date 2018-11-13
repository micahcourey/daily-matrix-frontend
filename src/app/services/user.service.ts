import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Headers, Response, RequestOptions } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  private loggedIn = false;
  public user = null;
	private apiUrl = environment.apiUrl;
	private loginStatusChange: Subject<any>;

  constructor(private http: HttpClient, private _apiService: ApiService) { 
    this.loggedIn = !!localStorage.getItem('matrix_auth_token');
    this.user = JSON.parse(localStorage.getItem('matrix_user'));
		this.loginStatusChange = new Subject<any>();
		if (this.user) {
			console.log(this.user)
			this.loginStatusChange.next({logged_in: true});
		} else {
			console.log('not logged in', this.user)
			this.loginStatusChange.next({logged_in: false});
			console.log(this.loginStatusChange)
    }
  }

	getLoginStatusChangeSub(){
		console.log(this.loginStatusChange)
		return this.loginStatusChange;
	}
	doUpdate(){
    this.user = JSON.parse(localStorage.getItem('matrix_user'));
	}

	getOptions() {
    return { headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('matrix_auth_token')) };
  }

  extractData(res: Response) {  
		return res || {};
	}

	handleError (error: any) {
		console.error(error);
		let errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.error(errMsg); // log to console instead

		if(error.status == 401){
			localStorage.removeItem('matrix_auth_token');
			localStorage.removeItem('matrix_user');
			this.loginStatusChange.next({logged_in: false});
			throw new Error("Token Expired");
		}
		if(error.status == 400){ //form validation error
			return observableThrowError(error.json());
		}
		return observableThrowError(errMsg);
	}

  login(user) {
		return new Promise( (resolve, reject) => {
			let headers: any = new HttpHeaders();
			headers.append('Content-Type', 'application/json');

			try{
				let loginSub = this.http.post(`${this.apiUrl}/Users/login`, user).pipe(map(this.extractData));

				loginSub.subscribe((res: any) => {
					if (res.errors) {
						console.error(res.errors);
						reject(res);
					} else {
            console.log(res);
						localStorage.setItem('matrix_auth_token', res.id);
						this.setUser(res.userId, res.id).then((user) => {
							resolve(user);
						});
					} 
				}, (response) => {
          console.log(response)
					reject(response);
				});
			}catch(e){
				console.error(e);
			}
		});
	}

	isLoggedIn() {
		return !!localStorage.getItem('matrix_auth_token');
	 }
	 
	setUser(userId: string, token: string) {
		return new Promise( (resolve, reject) => {
			let sub = this.http.get(`${this.apiUrl}/Users/${userId}?access_token=${token}`)
			.pipe(map(this.extractData)).pipe(catchError(this.handleError));

			sub.subscribe((res) => { 
				localStorage.setItem('matrix_user', JSON.stringify(res));
				console.log(res)
				this.user = res;
				this.loggedIn = true;
				this.loginStatusChange.next({logged_in: true});
				resolve(res);
			}); 
		});
	}

	logout() {
		localStorage.removeItem('matrix_auth_token');
		localStorage.removeItem('matrix_user');

		this.user = null;
		this.loggedIn = false;
		this.loginStatusChange.next({logged_in: false});
	}

	// testUniqueResetParams(uniqueParams) {
	// 	return new Promise((resolve, reject) => {
	// 		const headers: any = new HttpHeaders();
	// 		headers.append('Content-Type', 'application/json');

	// 		const uniqueSub = this.http.post( this.apiUrl + '/test-unique', uniqueParams, this.getOptions()).pipe(map(this.extractData));

	// 		uniqueSub.subscribe((res: any) => {
	// 			resolve(res.data.username);
	// 		}, (res) => {
	// 			reject(res.error.message.errors);
	// 		});
	// 	});
	// }

	// resetPassword(resetValues){
	// 	return new Promise( (resolve, reject) => {
	// 		let headers: any = new HttpHeaders();
	// 		headers.append('Content-Type', 'application/json');

	// 		let loginSub = this.http.post( this.apiUrl + '/reset-password', resetValues, this.getOptions()).pipe(map(this.extractData));

	// 		loginSub.subscribe((res: any) => {
	// 			resolve(res);
	// 		}, (res) => {
	// 			reject(res);
	// 		});
	// 	});
	// }

	// requestPasswordToken(resetValues){
	// 	return new Promise( (resolve, reject) => {
	// 		let headers: any = new HttpHeaders();
	// 		headers.append('Content-Type', 'application/json');

	// 		let loginSub = this.http.post( this.apiUrl + '/request-password-token', resetValues, this.getOptions()).pipe(map(this.extractData));

	// 		loginSub.subscribe((res: any) => {
	// 			resolve(res);
	// 		}, (res) => {
	// 			reject(res);
	// 		});
	// 	});
	// }

	// submitResetPassword(resetValues){
	// 	return new Promise( (resolve, reject) => {
	// 		let headers: any = new HttpHeaders();
	// 		headers.append('Content-Type', 'application/json');

	// 		let loginSub = this.http.post( this.apiUrl + '/submit-reset-password', resetValues, this.getOptions()).pipe(map(this.extractData));

	// 		loginSub.subscribe((res: any) => {
	// 			resolve(res);
	// 		}, (res) => {
	// 			reject(res.error.message.errors);
	// 			console.error(res);
	// 		});
	// 	});
	// }




	// getUser() {
	// 	return this.user;
	// }

	// getUsername() {
	// 	if(this.user) {
	// 		return this.user.name;
	// 	} else {
	// 		return null;
	// 	}
	// }

	// getUserEmail() {
	// 	if(this.user) {
	// 		return this.user.email;
	// 	} else {
	// 		return null;
	// 	}
	// }

	// isSuper() {
	// 	if(!this.loggedIn || !this.user)
	// 		return false;

	// 	if(this.user.member_level_id == 1)
	// 		return true;
	// 	return false;
	// }

	// isAdmin() {
	// 	if(!this.loggedIn || !this.user)
	// 		return false;

	// 	if(this.user.member_level_id <= 2)
	// 		return true;
	// 	return false;
	// }
	
	// isTech() {
	// 	if(!this.loggedIn || !this.user)
	// 		return false;

	// 	if(this.user.member_level_id <= 3)
	// 		return true;
	// 	return false;
	// } 

	// isStaff() {
	// 	if(!this.loggedIn || !this.user)
	// 		return false;

	// 	if(this.user.member_level_id <= 4)
	// 		return true;
	// 	return false;
	// } 

}
