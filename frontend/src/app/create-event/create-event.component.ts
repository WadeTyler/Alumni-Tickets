import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {remixCalendarCheckLine} from '@ng-icons/remixicon';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {CreateEventRequest} from '../../../../types/event.types';
import {EventService} from '../core/services/event.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-event',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIcon
  ],
  providers: [provideIcons({ remixCalendarCheckLine})],
  templateUrl: './create-event.component.html',
  styles: ``
})
export class CreateEventComponent {

  MAX_DESCRIPTION_LENGTH: number = 500;

  createEventForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(this.MAX_DESCRIPTION_LENGTH)]),
    image: new FormControl(),
    date: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    total_tickets: new FormControl(0, [Validators.required]),
    ticket_price: new FormControl(0, [Validators.required]),
    tickets_remaining: new FormControl(0, [Validators.required]),
  });

  imagePreview: string | null = null;

  constructor(protected eventService: EventService, private router: Router) {
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // When the FileRead loads the image
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.createEventForm.patchValue({
          image: file
        });
      }

      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.createEventForm.patchValue({
      image: null
    });
  }

  submitCreateEventForm() {
    if (this.eventService.isCreatingEvent) {
      return;
    }

    const createRequest: CreateEventRequest = ({
      ...this.createEventForm.value,
      image: this.imagePreview,
      total_tickets: Number(this.createEventForm.get('total_tickets')?.value),
      tickets_remaining: Number(this.createEventForm.get('tickets_remaining')?.value),
      ticket_price: Number(this.createEventForm.get('ticket_price')?.value) * 100,  // Convert to cents
    })
    this.eventService.createEvent(createRequest).subscribe(event => {
      if (event) {
        console.log("Successfully created: ", event);
        this.router.navigate(['/events', event.id]);
      }
    })

  }


}
