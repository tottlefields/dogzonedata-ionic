import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchedulePageRoutingModule } from './schedule-routing.module';

import { SchedulePage } from './schedule.page';
import { EventItemComponent } from './event-item/event-item.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBirthdayCake, faCircle } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [SchedulePage, EventItemComponent]
})
export class SchedulePageModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faCircle, faBirthdayCake);
  }
}
