import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {EventDetailsComponent} from './event-details/event-details.component';
import {PurchaseTicketComponent} from './event-details/purchase-ticket/purchase-ticket.component';
import {CreateEventComponent} from './create-event/create-event.component';
import {AuthGuard} from './core/guards/auth.guard';
import {TicketsComponent} from './tickets/tickets.component';

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    title: "Login | Alumni Events"
  },
  {
    path: "signup",
    component: SignupComponent,
    title: "Signup | Alumni Events"
  },
  {
    path: "events/create",
    component: CreateEventComponent,
    title: "Create Event | Alumni Events",
    canActivate: [AuthGuard]
  },
  {
    path: "events/:id",
    component: EventDetailsComponent,
    title: "Event Details | Alumni Events"
  },
  {
    path: "events/:id/purchase-ticket",
    component: PurchaseTicketComponent,
    title: "Purchase Ticket | Alumni Events"
  },
  {
    path: "tickets",
    component: TicketsComponent,
    title: "Tickets | Alumni Events",
  },
  {
    path: "",
    component: HomeComponent,
    title: "Home | Alumni Events"
  }
];
