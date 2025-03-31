import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError, map, Observable, of} from 'rxjs';
import {CreateEventRequest} from '../../../types/event.types';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiURL = environment.apiUrl;

  // States
  isLoadingEvents: boolean = false;
  loadEventsError: string = '';

  isCreatingEvent: boolean = false;
  createEventError: string = '';

  isLoadingEvent: boolean = false;
  loadEventError: string = '';

  constructor(private http: HttpClient) { }

  // Attempt to fetch all events
  public loadEvents(): Observable<any> {
    this.isLoadingEvents = true;
    this.loadEventsError = '';

    return this.http.get<any>(`${this.apiURL}/events`).pipe(
      map((response => {
        this.isLoadingEvents = false;
        return response.events || [];
      })),
      catchError((e) => {
        this.loadEventsError = e.error.message || "Something went wrong. Try again later.";
        this.isLoadingEvents = false;
        return of([]);
      })
    );
  }

  // Attempt to fetch event by id
  public loadEventById(id: number): Observable<any> {
    this.isLoadingEvent = true;
    this.loadEventError = '';

    return this.http.get<any>(`${this.apiURL}/events/${id}`).pipe(
      map((response => {
        this.isLoadingEvent = false;
        return response.event || null;
      })),
      catchError(e => {
        this.isLoadingEvent = false;
        this.loadEventError = e.error.message || "Something went wrong. Try again later.";
        return of(null);
      })
    );
  }

  // Attempt to create event
  public createEvent(createRequest: CreateEventRequest): Observable<any> {
    this.isCreatingEvent = true;
    this.createEventError = '';

    return this.http.post<any>(`${this.apiURL}/events`, createRequest, {withCredentials: true}).pipe(
      map(response => {
        if (response.event) {
          this.isCreatingEvent = false;
          return response.event;
        }
        throw new Error(response.message || "Something went wrong. Try again later.");
      }),
      catchError(e => {
        this.isCreatingEvent = false;
        this.createEventError = e.error.message || "Something went wrong. Try again later.";
        return of(null);
      })
    )
  }

}
