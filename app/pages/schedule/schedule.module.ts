import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SchedulePageRoutingModule } from './schedule-routing.module';

import { SchedulePage } from './schedule.page';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBirthdayCake, faCircle } from '@fortawesome/free-solid-svg-icons';
import { EventItemComponent } from '../schedule/event-item/event-item.component';
import { AddEventComponent } from '../schedule/add-event/add-event.component';
import { AddReminderComponent } from '../schedule/add-reminder/add-reminder.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SchedulePageRoutingModule,
    FontAwesomeModule,
  ],
  declarations: [SchedulePage, EventItemComponent, AddReminderComponent, AddEventComponent],
  entryComponents: [AddReminderComponent, AddEventComponent]
})
export class SchedulePageModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faCircle, faBirthdayCake);
  }
}
