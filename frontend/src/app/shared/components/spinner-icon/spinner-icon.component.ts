import { Component } from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {remixLoader2Line} from '@ng-icons/remixicon';

@Component({
  selector: 'app-spinner-icon',
  imports: [NgIcon],
  providers: [provideIcons({
    remixLoader2Line
  })],
  template: `
    <ng-icon name="remixLoader2Line" class="text-lg animate-spin"></ng-icon>
  `,
  styles: ``
})
export class SpinnerIconComponent {

}
