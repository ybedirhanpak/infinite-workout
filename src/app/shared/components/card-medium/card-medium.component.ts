import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-medium',
  templateUrl: './card-medium.component.html',
  styleUrls: ['./card-medium.component.scss'],
})
export class CardMediumComponent {
  @Input() heart?: boolean;
  @Input() star?: boolean;
  @Input() sparkles?: boolean;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() text?: string;
  @Input() imageUrl?: string;
}
