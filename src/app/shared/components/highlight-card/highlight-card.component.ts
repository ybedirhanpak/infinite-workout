import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-highlight-card',
  templateUrl: './highlight-card.component.html',
  styleUrls: ['./highlight-card.component.scss'],
})
export class HighlightCardComponent implements OnInit {
  @Input() id?: string | number;
  @Input() imageUrl?: string;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() textList?: string[];
  @Input() actionButton?: {
    icon: string;
    color: string;
  };

  @Input() filter?: string = 'dark';

  @Input() skeleton?: boolean;

  @Output() onActionClick = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onActionButtonClick() {
    this.onActionClick.emit(this.id);
  }
}
