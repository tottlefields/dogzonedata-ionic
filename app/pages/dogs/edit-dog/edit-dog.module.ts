import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDogPageRoutingModule } from './edit-dog-routing.module';
import { EditDogPage } from './edit-dog.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    EditDogPageRoutingModule,
    SharedModule
  ],
  declarations: [EditDogPage]
})
export class EditDogPageModule {}
