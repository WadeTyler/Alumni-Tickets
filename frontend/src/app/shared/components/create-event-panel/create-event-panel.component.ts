import { Component } from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {remixCalendarCheckLine} from '@ng-icons/remixicon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-create-event-panel',
  imports: [NgIcon, RouterLink],
  providers: [provideIcons({ remixCalendarCheckLine})],
  templateUrl: './create-event-panel.component.html',
  styles: ``
})
export class CreateEventPanelComponent {

}
