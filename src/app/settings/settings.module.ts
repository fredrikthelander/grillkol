import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule } from 'devextreme-angular';

import { SettingsRoutingModule } from './settings-routing.module';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { SwishComponent } from './swish/swish.component';
import { FortnoxComponent } from './fortnox/fortnox.component';
import { VatsComponent } from './vats/vats.component';
import { CategoriesComponent } from './categories/categories.component';


@NgModule({
  declarations: [UsersComponent, ProductsComponent, SwishComponent, FortnoxComponent, VatsComponent, CategoriesComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule
  ]
})
export class SettingsModule { }
