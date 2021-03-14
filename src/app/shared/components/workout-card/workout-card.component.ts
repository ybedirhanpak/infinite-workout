import { Component, Input, OnInit } from '@angular/core';
import { Time } from '@models/workout.model';

@Component({
  selector: 'app-workout-card',
  templateUrl: './workout-card.component.html',
  styleUrls: ['./workout-card.component.scss'],
})
export class WorkoutCardComponent implements OnInit {
  @Input() name: string = 'Name';
  @Input() category: string = 'Category';
  @Input() imageUrl: string = 'assets/img/light-theme.png';
  @Input() duration: Time;

  durationString = '';

  ngOnInit() {
    this.durationString = `${this.duration.opts.time} ${this.duration.opts.unit}`;
  }
}
