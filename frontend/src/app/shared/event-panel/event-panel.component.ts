import {Component, Input} from '@angular/core';
import {EventType} from '../../../../../types/event.types';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-event-panel',
  imports: [
    RouterLink
  ],
  templateUrl: './event-panel.component.html',
  styles: ``
})
export class EventPanelComponent {
  @Input() event!: EventType;

  constructor() {

  }

}
