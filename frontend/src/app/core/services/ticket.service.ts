import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PurchaseTicketsRequest, Ticket} from '../../../types/ticket.types';
import {environment} from '../../../environments/environment';
import {catchError, map, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  // CONSTANTS
  apiURL: string = environment.apiUrl;
  DEFAULT_TICKET_TIMER: number = 600; // 10 minutes

  // States
  public isLoadingTickets: boolean = false;
  public loadTicketsError: string = '';

  public isPurchasingTickets: boolean = false;
  public purchaseTicketsError: string = '';

  public isUsingTicket: boolean = false;
  public useTicketError: string = '';

  public timeRemaining: number = this.DEFAULT_TICKET_TIMER;
  public canReduceTime: boolean = true;
  public isReducingTime: boolean = false;
  public isTimeExpired: boolean = false;

  public purchasedTickets: null | Ticket[] = null;

  constructor(private http: HttpClient) { }

  // Attempt purchase tickets
  purchaseTickets(purchaseRequest: PurchaseTicketsRequest) {
    if (this.isTimeExpired) {
      this.purchaseTicketsError = "You are not allowed to purchase tickets at this time.";
      return of(null);
    }

    this.isPurchasingTickets = true;
    this.purchaseTicketsError = '';

    if (this.canReduceTime) {
      // Pause timer if running
      this.stopReducingTime();
    }

    return this.http.post<any>(`${this.apiURL}/tickets/purchase`, purchaseRequest).pipe(
      map(response => {
        if (response.tickets) {
          this.isPurchasingTickets = false;
          this.purchasedTickets = response.tickets;
          return response.tickets;
        }
        else {
          throw new Error(response.message || "Something went wrong. Try again later.");
        }
      }),
      catchError((e) => {
        this.purchaseTicketsError = e.error.message || "Something went wrong. Try again later.";
        this.isPurchasingTickets = false;
        this.startReducingTime(); // Resume timer
        return of(null);
      })
    )
  }

  // Attempt to fetch tickets by codes
  public loadTicketsByCodes(codesStr: string) {
    this.isLoadingTickets = true;
    this.loadTicketsError = '';

    return this.http.get<any>(`${this.apiURL}/tickets?codes=${codesStr}`).pipe(
      map(response => {
        if (response.tickets) {
          this.isLoadingTickets = false;
          return response.tickets;
        }
        throw new Error(response.message);
      }),
      catchError(e => {
        this.loadTicketsError = e.error.message || "Something went wrong. Try again later.";
        this.isLoadingTickets = false;
        return of([]);
      })
    )
  }

  // Attempt to use ticket
  public useTicket(ticketCode: string) {
    this.isUsingTicket = true;
    this.useTicketError = '';

    return this.http.put<any>(`${this.apiURL}/tickets/${ticketCode}/use`, {}, {withCredentials: true}).pipe(
      map(response => {
        if (response.ticket) {
          this.isUsingTicket = false;
          return response.ticket;
        }
        throw new Error(response.message);
      }),
      catchError(e => {
        this.useTicketError = e.error.message || "Something went wrong. Try again later.";
        this.isUsingTicket = false;
        console.log(e);
        return of(null);
      })
    )
  }

  public startReducingTime() {
    if (this.isReducingTime) return;
    this.isReducingTime = true;
    this.canReduceTime = true;
    const reduceTime = setInterval(() => {
      // Check if allowed reduced time
      if (!this.canReduceTime) {
        this.isReducingTime = false;
        clearInterval(reduceTime);
      }

      // Check if time is expired
      else if (this.timeRemaining <= 0) {
        this.isTimeExpired = true;
        this.isReducingTime = false;
        clearInterval(reduceTime);
      }
      // Reduce time
      this.timeRemaining--;
    }, 1000);
  }

  public stopReducingTime() {
    this.canReduceTime = false;
  }


  public resetTime() {
    this.timeRemaining = this.DEFAULT_TICKET_TIMER;
  }

  public resetTimeExpired() {
    this.isTimeExpired = false;
  }

  public resetAndRestartTimer() {
    this.resetTime();
    this.resetTimeExpired();
    this.startReducingTime();
  }


}
