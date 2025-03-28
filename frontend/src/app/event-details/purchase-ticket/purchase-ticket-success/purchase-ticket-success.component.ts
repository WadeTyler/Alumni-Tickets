import { Component } from '@angular/core';
import {TicketService} from '../../../core/services/ticket.service';
import {EventType} from '../../../../../../types/event.types';
import {Title} from '@angular/platform-browser';
import {EventService} from '../../../core/services/event.service';
import {ActivatedRoute} from '@angular/router';
import {TicketPanelComponent} from '../../../shared/components/ticket-panel/ticket-panel.component';
import {OtherEventsComponent} from '../../../shared/components/other-events/other-events.component';

@Component({
  selector: 'app-purchase-ticket-success',
  imports: [
    TicketPanelComponent,
    OtherEventsComponent
  ],
  templateUrl: './purchase-ticket-success.component.html',
  styles: ``
})
export class PurchaseTicketSuccessComponent {

  event: EventType | null = null;

  constructor(private route: ActivatedRoute, protected ticketService: TicketService, private titleService: Title, protected eventService: EventService) {
  }

  ngOnInit() {
    // Check if purchased tickets
    if (!this.ticketService.purchasedTickets) {
      return;
    }


    this.route.paramMap.subscribe(paramMap => {
      // Get event id from route
      const idStr = paramMap.get('id');
      if (!idStr) return;

      const id = Number(idStr);

      if (id) {
        // Load event by id
        this.eventService.loadEventById(id).subscribe(event => {
          this.event = event;
          this.titleService.setTitle("Ticket's Purchased for " + event.name + " | Alumni Events");
        });
      }
    })
  }


}
