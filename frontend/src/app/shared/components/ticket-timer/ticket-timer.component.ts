import {Component} from '@angular/core';
import {TicketService} from '../../../core/services/ticket.service';

@Component({
  selector: 'app-ticket-timer',
  imports: [],
  templateUrl: './ticket-timer.component.html',
  styles: ``
})
export class TicketTimerComponent {

  constructor(protected ticketService: TicketService) {}

  protected readonly Math = Math;
}
