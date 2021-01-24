import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule } from 'devextreme-angular';

import { ReportsRoutingModule } from './reports-routing.module';
import { MainComponent } from './main/main.component';
import { OrderFilterPipe } from './pipes/order-filter.pipe';
import { SammanstPipe } from './pipes/sammanst.pipe';


@NgModule({
  declarations: [MainComponent, OrderFilterPipe, SammanstPipe],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule
  ]
})
export class ReportsModule { }
