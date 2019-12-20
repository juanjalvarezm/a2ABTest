import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleMesaPage } from './detalle-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleMesaPageRoutingModule {}
