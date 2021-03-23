import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-regular-card',
  templateUrl: './regular-card.component.html',
  styleUrls: ['./regular-card.component.scss'],
})
export class RegularCardComponent {
  @Input() filter: string = 'red-turquoise';
  @Input() title: string = 'Name';
  @Input() subtitle: string = 'Category';
  @Input() smallText: string = 'Duration';
  @Input() imageUrl: string = 'assets/img/light-theme.png';
}
