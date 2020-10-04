import { Component, Input, OnInit } from '@angular/core';
import { WorkoutService } from 'src/app/workout/services/workout.service';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-rest-time-picker',
  templateUrl: './rest-time-picker.component.html',
  styleUrls: ['./rest-time-picker.component.scss'],
})
export class RestTimePickerComponent implements OnInit {
  restTime = 0;
  restTimeString = '00:00:00';

  constructor(
    private workoutService: WorkoutService,
    private dateService: DateService
  ) {}

  ngOnInit() {
    this.workoutService.restTime.subscribe((value) => {
      this.restTime = value;
      this.restTimeString = this.dateService.secondsToString(this.restTime);
    });
  }

  ionViewWillEnter() {
    this.workoutService.fetchRestTime();
  }

  /**
   * Saves rest time value with workout service
   * @param event change of rest time
   */
  onRestTimeChange(event: any) {
    const restTimeValue = event.detail.value;
    this.workoutService
      .saveRestTime(this.dateService.stringToSeconds(restTimeValue))
      .catch(() => {
        // TODO: Display error message
      });
  }
}
