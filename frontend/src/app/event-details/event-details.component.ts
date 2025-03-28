import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {EventType} from '../../../../types/event.types';
import {EventService} from '../core/services/event.service';
import {Title} from '@angular/platform-browser';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {remixCalendar2Line, remixCouponLine, remixTimeLine} from '@ng-icons/remixicon';
import {EventPanelComponent} from '../shared/event-panel/event-panel.component';


@Component({
  selector: 'app-event-details',
  providers: [provideIcons({ remixCouponLine, remixCalendar2Line, remixTimeLine })],
  imports: [
    RouterLink,
    NgIcon,
    EventPanelComponent
  ],
  templateUrl: './event-details.component.html',
  styles: ``
})
export class EventDetailsComponent {

  event: EventType | null = null;

  otherEvents: EventType[] = [];

  constructor(private route: ActivatedRoute, protected eventService: EventService, private titleService: Title) { }

  ngOnInit() {
    // Get event id from route
    this.route.paramMap.subscribe(paramMap => {
      const idStr = paramMap.get('id');
      const id = Number(idStr);

      if (id) {
        // Load event
        this.eventService.loadEventById(id).subscribe((event: EventType) => {
          this.event = event;
          this.titleService.setTitle(event.name + " | Alumni Events");

          // Load other events
          if (event) {
            this.eventService.loadEvents().subscribe(events => {
              this.otherEvents = events.filter((e: EventType) => e.id !== id);
            })
          }
        })
      }
    });
  }

}
