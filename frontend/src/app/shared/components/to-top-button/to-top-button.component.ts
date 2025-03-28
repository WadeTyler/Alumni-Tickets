import { Component } from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {remixArrowUpCircleLine} from '@ng-icons/remixicon';

@Component({
  selector: 'app-to-top-button',
  imports: [NgIcon],
  providers: [provideIcons({remixArrowUpCircleLine})],
  template: `
    <button class="submit-btn fixed z-50 bottom-4 right-4 p-2!" type="button" (click)="scrollToTop()">
        <ng-icon name="remixArrowUpCircleLine" class="text-2xl"></ng-icon>
    </button>
  `,
  styles: ``
})
export class ToTopButtonComponent {

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
