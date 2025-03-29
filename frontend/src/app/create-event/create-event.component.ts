import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {remixBrain2Line, remixCalendarCheckLine} from '@ng-icons/remixicon';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {CreateEventRequest} from '../../../../types/event.types';
import {EventService} from '../core/services/event.service';
import {Router} from '@angular/router';
import {AiService} from '../core/services/ai.service';
import {SpinnerIconComponent} from '../shared/components/spinner-icon/spinner-icon.component';

@Component({
  selector: 'app-create-event',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIcon,
    SpinnerIconComponent
  ],
  providers: [provideIcons({ remixCalendarCheckLine, remixBrain2Line})],
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

  constructor(protected eventService: EventService, private router: Router, protected aiService: AiService) {
  }

  ngOnInit() {
    this.aiService.improveDescriptionError = '';
    this.eventService.createEventError = '';
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
    if (this.eventService.isCreatingEvent || this.aiService.isImprovingDescription) {
      return;
    }

    this.aiService.improveDescriptionError = '';

    const createRequest: CreateEventRequest = ({
      ...this.createEventForm.value,
      image: this.imagePreview,
      total_tickets: Number(this.createEventForm.get('total_tickets')?.value),
      tickets_remaining: Number(this.createEventForm.get('tickets_remaining')?.value),
      ticket_price: Number(this.createEventForm.get('ticket_price')?.value) * 100,  // Convert to cents
    })
    this.eventService.createEvent(createRequest).subscribe(event => {
      if (event) {
        this.router.navigate(['/events', event.id]);
      }
    })
  }

  handleImproveDescription() {
    if (this.aiService.isImprovingDescription || this.createEventForm.get('description')?.value.length === 0) return;

    this.aiService.improveDescription(this.createEventForm.get('description')?.value)
      .subscribe(improvedDescription => {
        if (improvedDescription) {
          this.createEventForm.patchValue({
            description: improvedDescription
          });
        }
    })

  }


}
