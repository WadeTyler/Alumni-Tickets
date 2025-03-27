import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    title: "Login | Alumni Events"
  },
  {
    path: "",
    component: HomeComponent,
    title: "Home | Alumni Events"
  }
];
