import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DogDetailPageRoutingModule } from './dog-detail-routing.module';

import { DogDetailPage } from './dog-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DogDetailPageRoutingModule
  ],
  declarations: [DogDetailPage]
})
export class DogDetailPageModule {}
