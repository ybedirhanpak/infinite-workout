import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  private MIN_S = 60;
  private HOUR_S = 3600;
  private MAX_S = this.HOUR_S * 100 - 1;

  constructor() {}

  padZero(num: number) {
    const zeros = '00';
    if (!num) {
      return zeros;
    }
    const numString = num.toString();
    return zeros.substr(0, zeros.length - numString.length) + numString;
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
