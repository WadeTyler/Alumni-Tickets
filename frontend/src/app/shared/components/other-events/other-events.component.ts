import {Component, Input} from '@angular/core';
import {EventType} from '../../../../../../types/event.types';
import {EventService} from '../../../core/services/event.service';
import {EventPanelComponent} from '../../event-panel/event-panel.component';

@Component({
  selector: 'app-other-events',
  imports: [
    EventPanelComponent
  ],
  templateUrl: './other-events.component.html',
  styles: ``
})
export class OtherEventsComponent {

  @Input() ignoreEventId!: number | undefined;
  otherEvents: EventType[] = [];

  constructor(protected eventService: EventService) {
  }

  ngOnInit() {
    // Load events
    this.eventService.loadEvents().subscribe((events: EventType[]) => {
      if (this.ignoreEventId) {
        // Filter out ignored eventId
        this.otherEvents = events.filter(e => e.id !== this.ignoreEventId);
      } else {
        this.otherEvents = events;
      }
    });
  }

}
