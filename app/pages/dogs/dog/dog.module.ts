import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSquare, faCheckSquare, faBirthdayCake, faBarcode } from '@fortawesome/free-solid-svg-icons';
import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';

import { DogPageRoutingModule } from './dog-routing.module';

import { DogPage } from './dog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [DogPage]
})
export class DogPageModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faSquare, faCheckSquare, farSquare, farCheckSquare, faStackOverflow, faGithub, faMedium, faBirthdayCake, faBarcode);
  }
}
