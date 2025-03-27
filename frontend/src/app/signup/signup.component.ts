import { Component } from '@angular/core';
import {NgIcon, provideIcons} from "@ng-icons/core";
import {NgClass, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from '../core/services/auth.service';
import {Router} from '@angular/router';
import {AuthRequest} from '../../../../types/auth.types';
import {remixLoginCircleLine} from '@ng-icons/remixicon';

@Component({
  selector: 'app-signup',
  imports: [
    NgIcon,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  providers: [provideIcons({ remixLoginCircleLine})],
  templateUrl: './signup.component.html',
  styles: ``
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(protected authService: AuthService, private router: Router) {
  }

  handleSignupSubmit(): void {
    if (this.authService.isSigningUp || !this.signupForm.valid) return;
    const signupRequest: AuthRequest = this.signupForm.value;

    this.authService.signup(signupRequest).subscribe((val) => {
      if (val) {
        this.router.navigate(['/']);
      }
    });
  }
}
