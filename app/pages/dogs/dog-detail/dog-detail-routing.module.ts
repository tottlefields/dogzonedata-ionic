import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DogDetailPage } from './dog-detail.page';

const routes: Routes = [
  {
    path: '',
    component: DogDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DogDetailPageRoutingModule {}
