import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

// Send unauthorized users to login/start page
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/start']);

// Automatically log in previous users
const redirectLoggedInToApp = () => redirectLoggedInTo(['/app']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'start',
    ...canActivate(redirectLoggedInToApp),
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
  },
/*   {
    path: 'app',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  }, */
  {
    path: 'app',
    ...canActivate(redirectUnauthorizedToLogin),
    loadChildren: () => import('./pages/layout/layout.module').then( m => m.LayoutPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
