import { Component, OnInit, ViewChild, NgZone, Input } from '@angular/core'
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatSnackBar} from '@angular/material';
import { SubscriptionLike as ISubscription } from 'rxjs'
import { debounceTime, take } from 'rxjs/operators'
import { FormGroup, Validators, FormControl } from '@angular/forms'
import {ErrorStateMatcher} from '@angular/material/core';
import * as moment from 'moment'
import { UserService } from '../../services/user.service'

@Component({
  selector: 'activity-editor',
  templateUrl: './activity-editor.component.html',
  styleUrls: ['./activity-editor.component.scss']
})
export class ActivityEditorComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize
  @Input() userTasks
  @Input() user

  todayForm: FormGroup
  tomorrowForm: FormGroup
  today: any
  yesterday: any
  tomorrow: any
  dateSub: ISubscription
  todaySub: ISubscription
  tomorrowSub: ISubscription
  yesterdaysTask
  tomorrowsTask
  todaysTask
  showForms: boolean
  todayError: boolean
  tomorrowError: boolean
  encouragingMessages: Array<string>

  constructor(private _userService: UserService, public snackBar: MatSnackBar, private ngZone: NgZone) {
    this.showForms = true
    this.todayError = false
    this.tomorrowError = false
    this.today = moment().format('YYYY-MM-DD')
    this.yesterday = this.setYesterday(this.today)
    this.tomorrow = this.setTomorrow(this.today)
    this.encouragingMessages = this.getEncouragingMessages()
    this.buildForms()
    this.buildSubscriptions()
  }

  ngOnInit() {
    if (this.userTasks) {
      this.yesterdaysTask = this.findTask(this.yesterday)
      this.todaysTask = this.findTask(this.today)
      this.tomorrowsTask = this.findTask(this.tomorrow)
      this.patchForms()
    }
  }

  buildForms() {
    this.todayForm = new FormGroup({    
			task: new FormControl('', [ Validators.required, Validators.minLength(20) ]),
			date: new FormControl(new Date(), [ ])
    })
    this.tomorrowForm = new FormGroup({    
			task: new FormControl('', [ Validators.required, Validators.minLength(20) ]),
			date: new FormControl(moment().add(1, 'days'), [ ])
    })
  }

  buildSubscriptions() {
    this.todaySub = this.todayForm.get('task').valueChanges.pipe(debounceTime(2000)).subscribe(() => {
      if (!this.todayForm.valid) {
        this.todayError = true
        return
      }
      this.todayError = false
      const task = this.findTask(this.today)
      if (task) {
        this.patchTask(this.todayForm.get('task').value, this.today, task.id)
        return
      }
      this.postTask(this.todayForm.get('task').value, this.today)
    })
    this.tomorrowSub = this.tomorrowForm.get('task').valueChanges.pipe(debounceTime(2000)).subscribe(() => {
      if (!this.tomorrowForm.valid) {
        this.tomorrowError = true
        return
      }
      this.tomorrowError = false
      const task = this.findTask(this.tomorrow)
      if (task) {
        this.patchTask(this.tomorrowForm.get('task').value, this.tomorrow, task.id)
        return
      }
      this.postTask(this.tomorrowForm.get('task').value, this.tomorrow)
    })
    this.dateSub = this.todayForm.get('date').valueChanges.subscribe(() => {
      setTimeout(() => {
        this.showForms = false
        const selectedDate = this.todayForm.get('date').value
        this.today = moment(selectedDate)
        this.yesterday = this.setYesterday(selectedDate)
        this.tomorrow = this.setTomorrow(selectedDate)
        if (this.today.diff(moment(), 'days') > -1) {
          this.showForms = true
        }
        if (this.userTasks) {
          this.yesterdaysTask = this.findTask(this.yesterday)
          this.todaysTask = this.findTask(this.today)
          this.tomorrowsTask = this.findTask(this.tomorrow)
        }
        this.patchForms()
      },1)
    })
  }

  setYesterday(today) {
    return moment(today).subtract(1, 'days')
  }

  setTomorrow(today) {
    console.log('setTomorrow', today,moment(today).add(1, 'days'))
    return moment(today).add(1, 'days')
  }

  findTask(day) {
    return this.userTasks.find(task => moment(task.date).format('ll') === moment(day).format('ll'))
  }

  patchForms() {
    if (this.todaysTask) {
      this.todayForm.get('task').patchValue(this.todaysTask.body, {emitEvent: false})
    } else {
      this.todayForm.get('task').patchValue('', {emitEvent: false})
    }
    if (this.tomorrowsTask) {
      this.tomorrowForm.get('task').patchValue(this.tomorrowsTask.body, {emitEvent: false})
    } else {
      this.tomorrowForm.get('task').patchValue('', {emitEvent: false})
    }
  }

  postTask(newTask, date) {
    const task = {body: newTask, date: date, userId: this.user.id}
    this._userService.postTask(task).then((res) => {
      this.userTasks.push(res)
      this.openSnackBar(this.generateMessage(), 'Saved')
    })
  }

  patchTask(existingTask, date, taskId) {
    const task = {body: existingTask, date: date, userId: this.user.id}
    this._userService.patchTask(task, taskId).then((res: any) => {
      this.userTasks = this.userTasks.filter(task => task.id !== res.id)
      this.userTasks.push(res)
      const message = this.generateMessage()
      console.log(message)
      this.openSnackBar(message, 'Saved')
      console.log(this.userTasks)
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    })
  }

  generateMessage() {
    const i = Math.floor(Math.random() * Math.floor(this.encouragingMessages.length))
    return this.encouragingMessages[i]
  } 

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  getEncouragingMessages() {
    return [
      "Wow you're really getting a lot done!",
      "Keep on crushing it!",
      "Another day another dollar.",
      "Great job, keep it up!"
    ]
  }

}
