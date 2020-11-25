import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DzdPageRoutingModule } from './dzd-routing.module';

import { DzdPage } from './dzd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DzdPageRoutingModule
  ],
  declarations: [DzdPage]
})
export class DzdPageModule {}
