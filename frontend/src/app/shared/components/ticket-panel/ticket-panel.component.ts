import {Component, Input} from '@angular/core';
import {EventType} from '../../../../../../types/event.types';
import {Ticket} from '../../../../../../types/ticket.types';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {remixCalendar2Line, remixTimeLine} from '@ng-icons/remixicon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-ticket-panel',
  imports: [
    NgIcon,
    RouterLink
  ],
  providers: [provideIcons({ remixCalendar2Line, remixTimeLine })],
  templateUrl: './ticket-panel.component.html',
  styles: ``
})
export class TicketPanelComponent {
  @Input() event!: EventType;
  @Input() ticket!: Ticket;
}
