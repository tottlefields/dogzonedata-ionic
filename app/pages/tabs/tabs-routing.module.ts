import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DogResolverService } from 'src/app/resolvers/dog-resolver.service';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dogs',
        loadChildren: () =>
          import('../dogs/dogs.module').then(m => m.DogsPageModule),
      },
      {
        path: 'schedule',
        loadChildren: () =>
          import('../schedule/schedule.module').then(m => m.SchedulePageModule),
      },
      {
        path: 'stats',
        loadChildren: () =>
          import('../stats/stats.module').then(
            m => m.StatsPageModule
          ),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../account/account.module').then(m => m.AccountPageModule),
      },
      {
        path: '',
        redirectTo: 'dogs',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: 'dogs/edit/:dogId',
    loadChildren: () => import('../dogs/edit-dog/edit-dog.module').then((m) => m.EditDogPageModule),
  },
  {
    path: 'dogs/weights/:dogId',
    resolve: {
      dog: DogResolverService
    },
    loadChildren: () => import('../dogs/weights/weights.module').then( m => m.WeightsPageModule)
  },
  {
    path: 'dogs/details/:dogId',
    resolve: {
      dog: DogResolverService
    },
    loadChildren: () => import('../dogs/dog-detail/dog-detail.module').then( m => m.DogDetailPageModule)
  }
  /* {
    path: 'dogs/:dogId',
    loadChildren: () => import('../dogs/dog-detail/dog-detail.module').then((m) => m.DogDetailPageModule ),
  } */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
