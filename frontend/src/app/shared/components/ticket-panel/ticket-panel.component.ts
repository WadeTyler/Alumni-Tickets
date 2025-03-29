import {Component, Input} from '@angular/core';
import {Ticket} from '../../../../../../types/ticket.types';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {remixCalendar2Line, remixTimeLine} from '@ng-icons/remixicon';
import {RouterLink} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

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
  @Input() eventName!: string;
  @Input() eventDate!: string;
  @Input() eventTime!: string;
  @Input() ticket!: Ticket;

  constructor(private sanitizer: DomSanitizer) {}

  convertBase64ToImageSource(base64String: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64String);
  }


}
