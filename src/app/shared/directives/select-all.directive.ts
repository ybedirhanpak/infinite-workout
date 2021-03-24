import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'ion-input[select-all]',
})
export class SelectAllDirective {
  constructor(private el: ElementRef) {}

  @HostListener('ionFocus')
  selectAll() {
    // Access to the native input element
    let nativeEl: HTMLInputElement = this.el.nativeElement.querySelector(
      'input'
    );

    if (nativeEl) {
      if (nativeEl.setSelectionRange) {
        // Select the text from start to end
        return nativeEl.setSelectionRange(0, nativeEl.value.length);
      }

      nativeEl.select();
    }
  }
}
