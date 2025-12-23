import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
      },
    ],
  },
];
