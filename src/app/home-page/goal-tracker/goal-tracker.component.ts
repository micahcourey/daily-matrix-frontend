import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'goal-tracker',
  templateUrl: './goal-tracker.component.html',
  styleUrls: ['./goal-tracker.component.scss']
})
export class GoalTrackerComponent implements OnInit {
  @Input() userGoals
  @Input() user 
  step = 0;

  quarters: Array<any>;

  constructor() { 
    console.log('quarters', this.quarters)
  }

  ngOnInit() {
    console.log(this.userGoals)
    if (this.userGoals) {
      this.quarters = this.getQuarters()
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  getQuarters() {
    return [
      { 
        quarter: moment().quarter(), 
        year: moment().format('YYYY'), 
        start: moment().quarter(moment().quarter()).format('ll'), 
        end: moment().add(1, 'Q').subtract(1, 'day').format('ll'),
        goals: this.userGoals.filter(goal => goal.quarter === moment().quarter())
      },
      { 
        quarter: moment().add(1, 'Q').quarter(), 
        year: moment().add(1, 'Q').format('YYYY'), 
        start: moment().quarter(moment().add(1, 'Q').quarter()).format('ll'), 
        end: moment().add(2, 'Q').subtract(1, 'day').format('ll'),
        goals: this.userGoals.filter(goal => goal.quarter === moment().add(1, 'Q').quarter())
      },
      { 
        quarter: moment().add(2, 'Q').quarter(),  
        year: moment().add(2, 'Q').format('YYYY'), 
        start: moment().add(2, 'Q').format('ll'), 
        end: moment().add(3, 'Q').subtract(1, 'day').format('ll'),
        goals: this.userGoals.filter(goal => goal.quarter === moment().add(2, 'Q').quarter())
      },
      { 
        quarter: moment().add(3, 'Q').quarter(), 
        year: moment().add(3, 'Q').format('YYYY'), 
        start: moment().add(3, 'Q').format('ll'), 
        end: moment().add(4, 'Q').subtract(1, 'day').format('ll'),
        goals: this.userGoals.filter(goal => goal.quarter === moment().add(3, 'Q').quarter())
      },
    ]
  }

}
