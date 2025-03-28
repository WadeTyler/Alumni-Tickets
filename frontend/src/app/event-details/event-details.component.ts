import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {EventType} from '../../../../types/event.types';
import {EventService} from '../core/services/event.service';
import {Title} from '@angular/platform-browser';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {remixCouponLine} from '@ng-icons/remixicon';


@Component({
  selector: 'app-event-details',
  providers: [provideIcons({ remixCouponLine })],
  imports: [
    RouterLink,
    NgIcon
  ],
  templateUrl: './event-details.component.html',
  styles: ``
})
export class EventDetailsComponent {

  event: EventType | null = null;

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
        })
      }
    });


  }

}
