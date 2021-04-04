import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageGalleryService {

  public IMAGES = [];
  public IMAGE_COUNT = 62;

  constructor() {
    for (let i = 1; i <= this.IMAGE_COUNT; i++) {
      this.IMAGES.push(`assets/img/workout/workout-${i}.jpg`);
    }
  }

  getRandomImage() {
    const imageNumber = Math.floor(Math.random() * this.IMAGE_COUNT + 1);
    return `assets/img/workout/workout-${imageNumber}.jpg`
  }
}
