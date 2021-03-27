import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-highlight-card',
  templateUrl: './highlight-card.component.html',
  styleUrls: ['./highlight-card.component.scss'],
})
export class HighlightCardComponent implements OnInit {
  @Input() imageUrl: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() textList: string[];
  @Input() actionButton: {
    icon: string;
    color: string;
  };

  @Input() filter: string = 'dark';

  constructor() {}

  ngOnInit() {}
}
