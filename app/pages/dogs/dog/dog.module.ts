import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSquare, faCheckSquare, faBirthdayCake, faBarcode, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';

import { DogPageRoutingModule } from './dog-routing.module';

import { DogPage } from './dog.page';
import { AddWeightComponent } from '../../stats/add-weight/add-weight.component';
import { DatesCardComponent } from './dates-card/dates-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [DogPage, AddWeightComponent, DatesCardComponent],
  entryComponents: [AddWeightComponent]
})
export class DogPageModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faSquare, faCheckSquare, farSquare, farCheckSquare, faStackOverflow, faGithub, faMedium, faBirthdayCake, faBarcode, faExclamationCircle);
  }
}
