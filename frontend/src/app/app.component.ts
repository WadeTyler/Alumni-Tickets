import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {AuthService} from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => console.log(user));
  }

}
