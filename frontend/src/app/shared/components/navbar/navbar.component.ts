import { Component } from '@angular/core';
import {provideIcons, NgIcon} from '@ng-icons/core';
import {
  remixCouponLine,
  remixCalendarEventLine,
  remixLoginBoxLine,
  remixLoginCircleLine,
  remixLogoutBoxLine
} from '@ng-icons/remixicon';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {ScrollService} from '../../../core/services/scroll.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [NgIcon, RouterLink, NgClass],
  providers: [provideIcons({ remixCouponLine, remixCalendarEventLine, remixLoginBoxLine, remixLoginCircleLine, remixLogoutBoxLine })],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {

  isHomePage: boolean = false;

  constructor(protected authService: AuthService, protected scrollService: ScrollService, protected router: Router) {
  }

  ngOnInit() {
    this.checkIfHomePage();
    this.router.events.subscribe(() => {
      this.checkIfHomePage();
    })
  }

  handleLogout(): void {
    if (this.authService.isLoggingOut) return;
    this.authService.logout().subscribe(val => console.log(val));
  }

  checkIfHomePage() {
    this.isHomePage = this.router.url === "/";
  }



}
