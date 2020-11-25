import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogsPageRoutingModule } from './dogs-routing.module';

import { DogsPage } from './dogs.page';
import { AddDogComponent } from './add-dog/add-dog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogsPageRoutingModule
  ],
  declarations: [DogsPage, AddDogComponent],
  entryComponents: [AddDogComponent]
})
export class DogsPageModule {}
