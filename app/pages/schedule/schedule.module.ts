import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SchedulePageRoutingModule } from './schedule-routing.module';

import { SchedulePage } from './schedule.page';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBirthdayCake, faCircle } from '@fortawesome/free-solid-svg-icons';
import { EventItemComponent } from './event-item/event-item.component';
import { AddEventComponent } from './add-event/add-event.component';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DogPickerComponent } from 'src/app/shared/pickers/dog-picker/dog-picker.component';
import { ReminderItemComponent } from './reminder-item/reminder-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SchedulePageRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  declarations: [SchedulePage, EventItemComponent, ReminderItemComponent, AddReminderComponent, AddEventComponent],
  entryComponents: [AddReminderComponent, AddEventComponent, DogPickerComponent]
})
export class SchedulePageModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faCircle, faBirthdayCake);
  }
}
