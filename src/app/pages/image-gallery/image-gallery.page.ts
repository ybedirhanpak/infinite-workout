import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

const IMAGES = [];

for (let i = 1; i < 36; i++) {
  IMAGES.push(`assets/img/workout/workout-${i}.jpg`);
}

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.page.html',
  styleUrls: ['./image-gallery.page.scss'],
})
export class ImageGalleryPage implements OnInit {
  images = IMAGES;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onImageClick(image: string) {
    this.modalCtrl.dismiss({
      image,
      role: 'select',
    });
  }
}
