import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ResolverService } from './services/resolver.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'inicio', loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule) },
  {path: 'detalle-mesa',
    loadChildren: () => import('./detalle-mesa/detalle-mesa.module').then( m => m.DetalleMesaPageModule)
  },
  {
    path: 'detalle-mesa/:id',
    resolve:{
      mesaDetalle: ResolverService
    },
    loadChildren: () => import('./detalle-mesa/detalle-mesa.module').then( m => m.DetalleMesaPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'productos/:id',
    resolve:{
      mesaDetalle: ResolverService
    },
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'productos-modal',
    loadChildren: () => import('./productos-modal/productos-modal.module').then( m => m.ProductosModalPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
