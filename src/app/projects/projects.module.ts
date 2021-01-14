import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule } from 'devextreme-angular';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';


@NgModule({
  declarations: [ProjectListComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule
  ]
})
export class ProjectsModule { }
