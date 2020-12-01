import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);
// const redirectLoggedInToDZD = () => redirectLoggedInTo(['dzd']);

const routes: Routes = [
  { path: '', redirectTo: 'dzd', pathMatch: 'full' },
  /*{
    path: '',
    loadChildren: () => import('./pages/dzd/dzd.module').then( m => m.DzdPageModule),
  },*/
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'dzd',
    loadChildren: () => import('./pages/dzd/dzd.module').then( m => m.DzdPageModule),
    canLoad: [AuthGuard]
  }
/*  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'dzd',
    loadChildren: () => import('./pages/dzd/dzd.module').then( m => m.DzdPageModule)
  } */
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
