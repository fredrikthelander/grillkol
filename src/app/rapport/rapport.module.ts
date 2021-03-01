import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxDataGridModule } from 'devextreme-angular';

import { RapportRoutingModule } from './rapport-routing.module';
import { RapportMainComponent } from './rapport-main/rapport-main.component';

@NgModule({
  declarations: [RapportMainComponent],
  imports: [
    CommonModule,
    RapportRoutingModule,
    DxDataGridModule
  ]
})
export class RapportModule { }
