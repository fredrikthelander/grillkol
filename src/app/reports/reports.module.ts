import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule, DxSelectBoxModule, DxTabsModule } from 'devextreme-angular';

import { ReportsRoutingModule } from './reports-routing.module';
import { MainComponent } from './main/main.component';
import { OrderFilterPipe } from './pipes/order-filter.pipe';
import { SammanstPipe } from './pipes/sammanst.pipe';
import { AdminComponent } from './admin/admin.component';
import { OrdersComponent } from './orders/orders.component';
import { DistributionComponent } from './distribution/distribution.component';
import { ProjectSelectorComponent } from './project-selector/project-selector.component';
import { TotalsComponent } from './totals/totals.component';


@NgModule({
  declarations: [MainComponent, OrderFilterPipe, SammanstPipe, AdminComponent, OrdersComponent, DistributionComponent, ProjectSelectorComponent, TotalsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule, DxSelectBoxModule, DxTabsModule
  ]
})
export class ReportsModule { }
