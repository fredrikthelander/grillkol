import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AdminComponent } from './admin/admin.component';
import { OrdersComponent } from './orders/orders.component';
import { DistributionComponent } from './distribution/distribution.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'main', component: MainComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'distribution', component: DistributionComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
