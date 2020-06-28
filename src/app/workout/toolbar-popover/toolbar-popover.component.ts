import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Input,
} from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-toolbar-popover',
  templateUrl: './toolbar-popover.component.html',
  styleUrls: ['./toolbar-popover.component.scss'],
})
export class ToolbarPopoverComponent implements OnInit {
  @ViewChild('workoutForm', { static: true }) workoutForm: NgForm;
  restTimeIn: string = '00:00:00';

  constructor(
    private popoverController: PopoverController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.restTimeIn = this.navParams.get('restTime');
  }

  dismissPopover() {
    const outRestTime = this.workoutForm.value['rest-time'];
    if (outRestTime && outRestTime.trim().length > 0) {
      this.popoverController.dismiss(outRestTime, 'confirm');
    } else {
      this.popoverController.dismiss(null, 'error');
    }
  }
}
