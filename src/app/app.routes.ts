import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'node-graph',
    pathMatch: 'full',
  },
  {
    path: 'node-graph',
    loadComponent: () =>
      import('./node-graph.component').then((m) => m.NodeGraphComponent),
  },
];
