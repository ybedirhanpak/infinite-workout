import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-workout-card',
  templateUrl: './workout-card.component.html',
  styleUrls: ['./workout-card.component.scss'],
})
export class WorkoutCardComponent {

  @Input() name: string = 'Name';
  @Input() category: string = 'Category';
  @Input() imageUrl: string = 'assets/img/light-theme.png';
  @Input() duration: string = '10 min';

}
