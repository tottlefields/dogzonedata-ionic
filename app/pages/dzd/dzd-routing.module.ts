import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { DzdPage } from './dzd.page';

const routes: Routes = [
  {
    path: '',
    component: DzdPage,
    // canLoad: [AuthGuard],
    children: [
      {
        path: 'dogs',
        loadChildren: () => import('../dogs/dogs.module').then(m => m.DogsPageModule)
      },
      {
        path: 'schedule',
        loadChildren: () => import('../schedule/schedule.module').then(m => m.SchedulePageModule)
      },
      {
        path: 'food',
        loadChildren: () => import('../food/food.module').then(m => m.FoodPageModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('../stats/stats.module').then(m => m.StatsPageModule)
      },
      {
        path: '',
        redirectTo: '/dzd/dogs',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dzd/dogs',
    pathMatch: 'full'
  }
];
/* const routes: Routes = [
  {
    path: 'dzd',
    component: DzdPage,
    children: [
      {
        path: 'dogs',
        loadChildren: () => import('../dogs/dogs.module').then(m => m.DogsPageModule)
      },
      {
        path: 'schedule',
        loadChildren: () => import('../schedule/schedule.module').then(m => m.SchedulePageModule)
      },
      {
        path: 'food',
        loadChildren: () => import('../food/food.module').then(m => m.FoodPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('../stats/stats.module').then(m => m.StatsPageModule)
      },
      {
        path: '',
        redirectTo: '/dzd/dogs',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/dzd/dogs',
    pathMatch: 'full'
  }
]; */

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DzdPageRoutingModule {}
