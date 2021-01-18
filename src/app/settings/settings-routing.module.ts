import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { SwishComponent } from './swish/swish.component';
import { FortnoxComponent } from './fortnox/fortnox.component';
import { VatsComponent } from './vats/vats.component';
import { CategoriesComponent } from './categories/categories.component';
import { GeneralComponent } from './general/general.component';

const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'swish', component: SwishComponent },
  { path: 'fortnox', component: FortnoxComponent },
  { path: 'vats', component: VatsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'general', component: GeneralComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
