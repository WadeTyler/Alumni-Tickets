import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TicketWithEventDetails} from '../../../../types/ticket.types';
import {TicketService} from '../core/services/ticket.service';
import {TicketPanelComponent} from '../shared/components/ticket-panel/ticket-panel.component';
import {OtherEventsComponent} from '../shared/components/other-events/other-events.component';
import {SpinnerIconComponent} from '../shared/components/spinner-icon/spinner-icon.component';

@Component({
  selector: 'app-tickets',
  imports: [
    TicketPanelComponent,
    OtherEventsComponent,
    SpinnerIconComponent
  ],
  templateUrl: './tickets.component.html',
  styles: ``
})
export class TicketsComponent {

  // States
  tickets: TicketWithEventDetails[] = [];
  justPurchased: boolean = false;

  constructor(private route: ActivatedRoute, protected ticketService: TicketService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      this.justPurchased = this.route.snapshot.queryParamMap.get('justPurchased') === 'true';

      // Load codes from query params (?codes=code1,code2...)
      const codesStr = this.route.snapshot.queryParamMap.get('codes');
      // If no codes, return
      if (!codesStr) return;

      // Load Tickets
      this.ticketService.loadTicketsByCodes(codesStr).subscribe(
        (tickets) => {
          if (tickets) {
            this.tickets = tickets;
          }
        }
      );
    })
  }

}
