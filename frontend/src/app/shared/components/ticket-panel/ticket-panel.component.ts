import {Component, Input} from '@angular/core';
import {TicketWithEventDetails} from '../../../../types/ticket.types';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {remixCalendar2Line, remixTimeLine} from '@ng-icons/remixicon';
import {RouterLink} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthService} from '../../../core/services/auth.service';
import {TicketService} from '../../../core/services/ticket.service';

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
  @Input() ticket!: TicketWithEventDetails;

  _useTicketError: string = '';

  constructor(private sanitizer: DomSanitizer, protected authService: AuthService, protected ticketService: TicketService) {}

  ngOnInit() {
    this._useTicketError = '';
  }

  convertBase64ToImageSource(base64String: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64String);
  }

  handleUseTicket(): void {
    if (this.ticketService.isUsingTicket) return;

    this._useTicketError = '';

    this.ticketService.useTicket(this.ticket.code).subscribe(
      (ticket) => {
        if (ticket) {
          this.ticket.used = true;
        } else {
          this._useTicketError = this.ticketService.useTicketError;
        }
      }
    )
  }


}
