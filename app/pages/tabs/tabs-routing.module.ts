import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
      /* {
        path: 'search',
        loadChildren: () =>
          import('../search/search.module').then(m => m.SearchPageModule),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('../notifications/notifications.module').then(
            m => m.NotificationsPageModule
          ),
      }, */
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
