import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule, DxDateBoxModule } from 'devextreme-angular';

import { NgxSmartModalModule } from 'ngx-smart-modal';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { Nl2brPipe } from './pipes/nl2br.pipe';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';


@NgModule({
  declarations: [ProjectListComponent, Nl2brPipe, SanitizeHtmlPipe],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    DxDataGridModule, DxPopupModule, DxButtonModule, DxTextBoxModule, DxValidatorModule, DxValidationGroupModule, DxValidationSummaryModule, DxTagBoxModule, DxTextAreaModule, DxDateBoxModule,
    NgxSmartModalModule.forChild()
  ]
})
export class ProjectsModule { }
