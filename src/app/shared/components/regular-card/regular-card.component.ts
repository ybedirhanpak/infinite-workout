import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-regular-card',
  templateUrl: './regular-card.component.html',
  styleUrls: ['./regular-card.component.scss'],
})
export class RegularCardComponent {
  @Input() heart: boolean;
  @Input() star: boolean;
  @Input() sparkles: boolean;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() text: string;
  @Input() imageUrl: string;
}
