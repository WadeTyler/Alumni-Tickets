import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { remixLoginBoxLine } from '@ng-icons/remixicon';
import {AuthService} from '../core/services/auth.service';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthRequest} from '../../../../types/auth.types';
import {Router} from "@angular/router";
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [NgIcon, ReactiveFormsModule, NgClass, NgIf],
  providers: [provideIcons({ remixLoginBoxLine })],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(protected authService: AuthService, private router: Router) {
  }

  handleLoginSubmit(): void {
    if (this.authService.isLoggingIn || !this.loginForm.valid) return;
    const loginRequest: AuthRequest = this.loginForm.value;

    this.authService.login(loginRequest).subscribe((val) => {
      if (val) {
        this.router.navigate(['/']);
      }
    });
  }

}
