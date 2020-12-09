import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogsPageRoutingModule } from './dogs-routing.module';

import { DogsPage } from './dogs.page';
import { AddDogComponent } from './add-dog/add-dog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImagePickerComponent } from 'src/app/shared/pickers/image-picker/image-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DogsPageRoutingModule,
    SharedModule,
  ],
  declarations: [DogsPage, AddDogComponent],
  entryComponents: [AddDogComponent, ImagePickerComponent]
})
export class DogsPageModule {}
