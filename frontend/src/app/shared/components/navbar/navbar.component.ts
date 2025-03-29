import { Component } from '@angular/core';
import {provideIcons, NgIcon} from '@ng-icons/core';
import {
  remixCouponLine,
  remixCalendarEventLine,
  remixLoginBoxLine,
  remixLoginCircleLine,
  remixLogoutBoxLine, remixMoonLine, remixSunLine
} from '@ng-icons/remixicon';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {ScrollService} from '../../../core/services/scroll.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [NgIcon, RouterLink, NgClass],
  providers: [provideIcons({ remixCouponLine, remixCalendarEventLine, remixLoginBoxLine, remixLoginCircleLine, remixLogoutBoxLine, remixMoonLine, remixSunLine })],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {

  isDarkMode: boolean = false;
  isHomePage: boolean = false;

  constructor(protected authService: AuthService, protected scrollService: ScrollService, protected router: Router) {
  }

  ngOnInit() {
    this.checkIfHomePage();
    this.router.events.subscribe(() => {
      this.checkIfHomePage();
    });

    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.setTheme();
  }

  setTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.setTheme();
  }

  handleLogout(): void {
    if (this.authService.isLoggingOut) return;
    this.authService.logout().subscribe();
  }

  checkIfHomePage() {
    this.isHomePage = this.router.url === "/";
  }



}
