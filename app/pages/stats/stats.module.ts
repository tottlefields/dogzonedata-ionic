import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatsPageRoutingModule } from './stats-routing.module';

import { StatsPage } from './stats.page';
import { AddWeightComponent } from './add-weight/add-weight.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatsPageRoutingModule
  ],
  declarations: [StatsPage, AddWeightComponent],
  entryComponents: [AddWeightComponent]
})
export class StatsPageModule {}
