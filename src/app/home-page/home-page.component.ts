import { Component, OnInit, OnChanges } from '@angular/core';
import { UserService } from './../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnChanges {
  user: any
  userTasks: any
  allTasks: any
  loggedIn: boolean
  newTask: string
  today: Date
  yesterday: Date
  tomorrow: Date

  constructor(private _userService: UserService, private router: Router) { 
    this.loggedIn = false
    this.newTask = ''
    this.today = new Date()
    this.yesterday = this.setYesterday(this.today)
    this.tomorrow = this.setTomorrow(this.today)
    if (this._userService.isLoggedIn()) {
      this.loggedIn = true;
    }
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('matrix_user'))
    this._userService.getTasks().then((tasks: Array<any>) => {
      console.log(tasks)
      this.allTasks = tasks
      this.userTasks = tasks.filter(task => task.userId === this.user.id)
      console.log('userTasks', this.userTasks)
    })
  }

  ngOnChanges() {
    if (this._userService.isLoggedIn()) {
      this.loggedIn = true;
    }
  }

  logout() {
    this._userService.logout()
    this.loggedIn = false;
    this.router.navigate(['/'])
  }

  setYesterday(today) {
    return today.setDate(today.getDate() -1)
  }

  setTomorrow(today) {
    return today.setDate(today.getDate() +1)
  }

  postTask() {
    const task = {body: this.newTask, date: new Date(), userId: this.user.id}
    this._userService.postTask(task).then((res) => {
      this.userTasks.push(res);
    })
  }

}
