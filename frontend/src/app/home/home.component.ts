import {Component, ElementRef, ViewChild} from '@angular/core';
import {EventService} from '../core/services/event.service';
import {EventType} from '../../../../types/event.types';
import {EventPanelComponent} from '../shared/components/event-panel/event-panel.component';
import {CreateEventPanelComponent} from '../shared/components/create-event-panel/create-event-panel.component';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {remixCalendarTodoLine} from '@ng-icons/remixicon';

@Component({
  selector: 'app-home',
  imports: [
    EventPanelComponent,
    CreateEventPanelComponent,
    NgIcon
  ],
  providers: [provideIcons({ remixCalendarTodoLine })],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  events: EventType[] = [];
  @ViewChild('eventsContainer') eventsContainer!: ElementRef;

  constructor(protected eventService: EventService) { }

  ngOnInit() {
    // Load events on init
    this.eventService.loadEvents().subscribe({
      next: (events) => {
        this.events = events;
        console.log("Events loaded.");
      },
      error: (error) => {
        console.error("Error loading events: ", error);
      }
    })
  }

  scrollToEventsContainer(): void {
    this.eventsContainer.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

}
