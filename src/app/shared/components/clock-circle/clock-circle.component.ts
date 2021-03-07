import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DateService } from '@services/date.service';

@Component({
  selector: 'app-clock-circle',
  templateUrl: './clock-circle.component.html',
  styleUrls: ['./clock-circle.component.scss'],
})
export class ClockCircleComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mode: 'timer' | 'stopwatch' = 'stopwatch';
  @Input() max = 60;
  @Input() current = 0;
  @Input() pause = false;
  @Input() reset = false;

  currentString = '00:00';
  percent = 0;
  tickInterval: NodeJS.Timeout;

  constructor(private dateService: DateService) {}

  ngOnInit() {
    this.updateCircle();
  }

  ngOnDestroy() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('pause' in changes) {
      const { currentValue, previousValue } = changes['pause'];
      this.onPauseChange(currentValue, previousValue);
    }

    if ('reset' in changes) {
      const { currentValue, previousValue } = changes['reset'];
      this.onResetChange(currentValue, previousValue);
    }
  }

  onPauseChange(value: boolean, prev: boolean) {
    if (value && this.tickInterval) {
      clearInterval(this.tickInterval);
    }

    if (!value) {
      this.tickInterval = setInterval(() => {
        this.tick();
      }, 1000);
    }
  }

  onResetChange(value: boolean, prev: boolean) {
    if(value)
      this.resetClock();
  }

  updateCircle() {
    this.currentString = this.dateService.secondsToString(this.current);

    if (this.mode === 'timer') {
      this.percent = ((this.max - this.current) / this.max) * 100;
    }

    if (this.mode === 'stopwatch') {
      this.percent = (this.current / this.max) * 100;
    }
  }

  resetClock() {
    if (this.mode === 'timer') {
      this.current = this.max;
    }

    if (this.mode === 'stopwatch') {
      this.current = 0;
    }

    this.updateCircle();
  }

  tick() {
    if (this.reset) {
      this.resetClock();
      return;
    }

    if (this.pause) {
      return;
    }

    // Timer mode
    if (this.mode === 'timer' && this.current > 0) {
      this.current--;
    }

    // Stopwatch mode
    if (this.mode === 'stopwatch' && this.current < this.max) {
      this.current++;
    }

    this.updateCircle();
  }
}
