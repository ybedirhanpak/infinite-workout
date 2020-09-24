import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private MIN_S = 60;
  private HOUR_S = 3600;
  private MAX_S = this.HOUR_S * 100 - 1;

  constructor() {}

  /**
   * Adds 0 prefix to numbers less than 10
   *
   * @param num number to be padded
   */
  padZero(num: number) {
    if (!num || num < 0) {
      return '00';
    } else if (num < 10) {
      return `0${num}`;
    }
    return num.toString();
  }

  stringToSeconds(str: string) {
    const split = str.split(':');

    const h = parseInt(split[0], 10) || 0;
    const m = parseInt(split[1], 10) || 0;
    const s = parseInt(split[2], 10) || 0;

    return h * this.HOUR_S + m * this.MIN_S + s;
  }

  secondsToString(sec: number) {
    let seconds = Math.min(sec, this.MAX_S);
    const hours = Math.floor(seconds / this.HOUR_S);
    seconds = seconds % this.HOUR_S;
    const mins = Math.floor(seconds / this.MIN_S);
    seconds = seconds % this.MIN_S;

    return `${this.padZero(hours)}:${this.padZero(mins)}:${this.padZero(
      seconds
    )}`;
  }
}
