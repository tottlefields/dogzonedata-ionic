import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DogResolverService } from 'src/app/resolvers/dog-resolver.service';

import { DogsPage } from './dogs.page';

const routes: Routes = [
  {
    path: '',
    component: DogsPage
  },
/*   {
    path: 'edit/:dogId',
    loadChildren: () => import('./edit-dog/edit-dog.module').then((m) => m.EditDogPageModule),
  }, */
  {
    path: ':dogId',
    resolve: {
      dog: DogResolverService
    },
    loadChildren: () => import('./dog-detail/dog-detail.module').then((m) => m.DogDetailPageModule ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DogsPageRoutingModule {}
