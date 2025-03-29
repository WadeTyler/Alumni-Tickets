import {Component, HostListener} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {AuthService} from './core/services/auth.service';
import {ScrollService} from './core/services/scroll.service';
import {ToTopButtonComponent} from './shared/components/to-top-button/to-top-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToTopButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(private authService: AuthService, protected scrollService: ScrollService) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.scrollService.updateIsAtTop();
  }

}
