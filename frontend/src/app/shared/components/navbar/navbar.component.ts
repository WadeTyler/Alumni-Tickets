import { Component } from '@angular/core';
import {provideIcons, NgIcon} from '@ng-icons/core';
import { remixCouponLine, remixCalendarEventLine, remixLoginBoxLine, remixLoginCircleLine } from '@ng-icons/remixicon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [NgIcon, RouterLink],
  providers: [provideIcons({ remixCouponLine, remixCalendarEventLine, remixLoginBoxLine, remixLoginCircleLine })],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {

}
