import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule } from 'devextreme-angular';

import { SalespersonsRoutingModule } from './salespersons-routing.module';
import { MainComponent } from './main/main.component';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    SalespersonsRoutingModule,
    DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule
  ]
})
export class SalespersonsModule { }
