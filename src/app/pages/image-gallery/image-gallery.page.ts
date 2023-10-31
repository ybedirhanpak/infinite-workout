import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageGalleryService } from '@services/image-gallery.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.page.html',
  styleUrls: ['./image-gallery.page.scss'],
})
export class ImageGalleryPage implements OnInit {
  images: string[] = [];

  constructor(
    private imageGalleryService: ImageGalleryService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.images = this.imageGalleryService.IMAGES;
  }

  onImageClick(image: string) {
    this.modalCtrl.dismiss({
      image,
      role: 'select',
    });
  }

  onCancelClick() {
    this.modalCtrl.dismiss({
      role: 'cancel',
    });
  }
}
