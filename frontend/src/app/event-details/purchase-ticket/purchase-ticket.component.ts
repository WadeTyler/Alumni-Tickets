import {Component} from '@angular/core';
import {EventType} from '../../../types/event.types';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {EventService} from '../../core/services/event.service';
import {Title} from '@angular/platform-browser';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {remixCalendar2Line, remixShoppingCartLine, remixTimeLine} from '@ng-icons/remixicon';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PurchaseTicketsRequest, Ticket} from '../../../types/ticket.types';
import {TicketService} from '../../core/services/ticket.service';
import {NgIf} from '@angular/common';
import {TicketTimerComponent} from '../../shared/components/ticket-timer/ticket-timer.component';
import {SpinnerIconComponent} from '../../shared/components/spinner-icon/spinner-icon.component';

@Component({
  selector: 'app-purchase-ticket',
  imports: [
    NgIcon,
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    TicketTimerComponent,
    SpinnerIconComponent
  ],
  providers: [provideIcons({remixCalendar2Line, remixTimeLine, remixShoppingCartLine})],
  templateUrl: './purchase-ticket.component.html',
  styles: ``
})
export class PurchaseTicketComponent {

  purchaseTicketsForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    last_name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(317)]),
    quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(3)]),
  });

  event: EventType | null = null;
  totalPrice: number = 0;
  purchasedTickets: null | Ticket[] = null;

  constructor(private route: ActivatedRoute,
              protected eventService: EventService,
              protected ticketService: TicketService,
              private titleService: Title,
              private router: Router) {
  }

  ngOnInit() {
    // Get event id from route
    this.route.paramMap.subscribe(paramMap => {
      const idStr = paramMap.get('id');
      const id = Number(idStr);

      if (id) {
        // Load event
        this.eventService.loadEventById(id).subscribe((event: EventType) => {
          if (event) {
            this.event = event;
            this.titleService.setTitle("Purchase Tickets for " + event.name + " | Alumni Events");
            this.ticketService.resetAndRestartTimer();

            // Set initial price
            this.totalPrice = this.event.ticket_price;

            // Listen for quantity changes
            this.purchaseTicketsForm.get("quantity")?.valueChanges.subscribe(quantity => {
              // Only update price if 1-3 tickets are selected
              if (quantity <= 3 && quantity >= 1) {
                this.totalPrice = event.ticket_price * quantity;
              }
            })
          }
        });
      }
    });
  }

  submitPurchaseForm() {
    if (this.ticketService.isTimeExpired || !this.event || this.purchaseTicketsForm.invalid || this.ticketService.isPurchasingTickets || this.event.tickets_remaining === 0) {
      this.purchaseTicketsForm.get('first_name')?.markAsTouched();
      this.purchaseTicketsForm.get('last_name')?.markAsTouched();
      this.purchaseTicketsForm.get('email')?.markAsTouched();
      this.purchaseTicketsForm.get('quantity')?.markAsTouched();
      return;
    }


    const purchaseRequest: PurchaseTicketsRequest = ({
      ...this.purchaseTicketsForm.value, event_id: this.event.id
    });

    this.ticketService.purchaseTickets(purchaseRequest).subscribe((tickets: Ticket[]) => {
      if (tickets) {
        // Navigate to tickets page

        const codeStr = tickets.map((ticket) => ticket.code).join(',');

        this.router.navigate(['/tickets'], {
          queryParams: {
            codes: codeStr,
            justPurchased: 'true'
          }
        });
      }
    })
  }

}
