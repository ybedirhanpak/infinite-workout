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
  pad(num: number) {
    if (!num || num < 0) {
      return '00';
    } else if (num < 10) {
      return `0${num}`;
    }
    return num.toString();
  }

  /**
   * Converts string to second.
   * Expects strings to be in format 'HH:MM:SS' or 'MM:SS'
   *
   * @param str string to be converted to second
   */
  stringToSeconds(str: string) {
    const split = str.split(':');

    if (split.length === 2) {
      // MM:SS format
      const minute = parseInt(split[0], 10) || 0;
      const second = parseInt(split[0], 10) || 0;

      return minute * this.MIN_S + second;
    }

    if (split.length === 3) {
      // HH:MM:SS format
      const hour = parseInt(split[0], 10) || 0;
      const minute = parseInt(split[1], 10) || 0;
      const second = parseInt(split[2], 10) || 0;

      return hour * this.HOUR_S + minute * this.MIN_S + second;
    }

    throw new Error('String format must be either "HH:MM:SS" or "MM:SS"');
  }

  /**
   * Convert second to time string in format 'HH:MM:SS' or 'MM:SS'
   *
   * @param sec second to be converted
   * @param forceHours if format forced to be 'HH:MM:SS'
   */
  secondsToString(sec: number, forceHours = false) {
    let seconds = Math.min(sec, this.MAX_S);
    const hours = Math.floor(seconds / this.HOUR_S);
    seconds = seconds % this.HOUR_S;
    const mins = Math.floor(seconds / this.MIN_S);
    seconds = seconds % this.MIN_S;

    if (forceHours || hours > 0) {
      return `${this.pad(hours)}:${this.pad(mins)}:${this.pad(seconds)}`;
    }

    return `${this.pad(mins)}:${this.pad(seconds)}`;
  }
}
