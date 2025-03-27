import { Component } from '@angular/core';
import {provideIcons, NgIcon} from '@ng-icons/core';
import {
  remixCouponLine,
  remixCalendarEventLine,
  remixLoginBoxLine,
  remixLoginCircleLine,
  remixLogoutBoxLine
} from '@ng-icons/remixicon';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [NgIcon, RouterLink],
  providers: [provideIcons({ remixCouponLine, remixCalendarEventLine, remixLoginBoxLine, remixLoginCircleLine, remixLogoutBoxLine })],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {

  constructor(protected authService: AuthService) {
  }

  handleLogout(): void {
    if (this.authService.isLoggingOut) return;
    this.authService.logout().subscribe(val => console.log(val));
  }

}
