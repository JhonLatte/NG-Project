import { Routes } from '@angular/router';
import { canAuth, canVerify } from '@app-shared/services';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    loadComponent: () => import('./features/home/home.component'),
  },

  {
    path: 'contact',
    title: 'contact',
    loadComponent: () => import('./features/contact/contact.component'),
  },


  {
    path: 'footer',
    title: 'Footer',
    loadComponent: () => import('./features/footer/footer.component'),
  },

  {
    path: 'products',
    title: 'products',
    loadComponent: () => import('./features/products/products.component'),
  },
  {
    path: 'auth',
    title: 'auth',
    data: {
      hideHorizontalLine: true,
    },
    canActivate: [canAuth],
    loadComponent: () => import('./features/auth/auth.component'),
  },
  {
    path: 'verify',
    title: 'verify',
    data: {
      hideHorizontalLine: true,
    },
    canActivate: [canVerify],
    loadComponent: () => import('./features/verify/verify.component'),
  },
  {
    path: '404',
    title: 'Not found',
    loadComponent: () => import('./features/notfound/notfound.component'),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
];
