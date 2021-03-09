import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DateService } from '@services/date.service';

@Component({
  selector: 'app-clock-circle',
  templateUrl: './clock-circle.component.html',
  styleUrls: ['./clock-circle.component.scss'],
})
export class ClockCircleComponent implements OnInit, OnDestroy {
  @Input() id = -1;
  @Input() mode: 'timer' | 'stopwatch' = 'stopwatch';
  @Input() max = 60;
  @Input() current = 0;

  @Output() onFinish = new EventEmitter<boolean>();

  paused = true;
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

  updateCircle() {
    this.currentString = this.dateService.secondsToString(this.current);

    if (this.mode === 'timer') {
      this.percent = ((this.max - this.current) / this.max) * 100;
    }

    if (this.mode === 'stopwatch') {
      this.percent = (this.current / this.max) * 100;
    }
  }

  public start() {
    if (!this.tickInterval) {
      this.paused = false;
      this.tickInterval = setInterval(() => {
        this.tick();
      }, 1000);
    }
  }

  public pause() {
    if (this.tickInterval) {
      this.paused = true;
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  public reset() {
    // If clock was running before reset, reset and continue
    // If clock was stopped before, only reset the time
    const runningBeforeReset = !this.paused;

    if (runningBeforeReset) this.pause();

    if (this.mode === 'timer') {
      this.current = this.max;
    }

    if (this.mode === 'stopwatch') {
      this.current = 0;
    }

    this.updateCircle();

    if (runningBeforeReset) this.start();
  }

  public stop() {
    this.reset();
    this.pause();
  }

  public updateMax(max: number) {
    this.pause();
    this.max = max;
    this.reset();
    this.start();
  }

  tick() {
    // Timer mode
    if (this.mode === 'timer' && this.current > 0) {
      this.current--;

      if (this.current === 0) {
        this.onFinish.emit(true);
      }
    }

    // Stopwatch mode
    if (this.mode === 'stopwatch' && this.current < this.max) {
      this.current++;
      if (this.current === this.max) {
        this.onFinish.emit(true);
      }
    }

    this.updateCircle();
  }
}
