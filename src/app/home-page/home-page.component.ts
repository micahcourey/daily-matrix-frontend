import { Component, OnInit, ViewChild, NgZone } from '@angular/core'
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatSnackBar} from '@angular/material';
import { SubscriptionLike as ISubscription } from 'rxjs'
import { debounceTime, take } from 'rxjs/operators'
import { FormGroup, Validators, FormControl } from '@angular/forms'
import * as moment from 'moment'
import { UserService } from './../services/user.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  user: any
  userTasks: any
  allTasks: any
  userGoals: any
  allGoals: any

  constructor(private _userService: UserService, private router: Router, public snackBar: MatSnackBar, private ngZone: NgZone) { 

  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('matrix_user'))
    this._userService.getTasks().then((tasks: Array<any>) => {
      console.log(tasks)
      this.allTasks = tasks
      this.userTasks = tasks.filter(task => task.userId === this.user.id)
      console.log('userTasks', this.userTasks)
    }, (error) => {
      console.log(error)
    })
    this._userService.getGoals().then((goals: Array<any>) => {
      console.log('all goals', goals)
      this.allGoals = goals
      this.userGoals = goals.filter(goal => goal.userId === this.user.id)
    }, (error) => {
      console.log(error)
    })
  }

  logout() {
    this._userService.logout()
    this.router.navigate(['/'])
  }

}
