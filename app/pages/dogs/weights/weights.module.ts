import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeightsPageRoutingModule } from './weights-routing.module';

import { WeightsPage } from './weights.page';
import { AddWeightComponent } from '../../stats/add-weight/add-weight.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeightsPageRoutingModule
  ],
  declarations: [WeightsPage, AddWeightComponent],
  entryComponents: [AddWeightComponent]
})
export class WeightsPageModule {}
