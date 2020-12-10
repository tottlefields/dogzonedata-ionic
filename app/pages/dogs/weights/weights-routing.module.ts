import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WeightsPage } from './weights.page';

const routes: Routes = [
  {
    path: '',
    component: WeightsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeightsPageRoutingModule {}
